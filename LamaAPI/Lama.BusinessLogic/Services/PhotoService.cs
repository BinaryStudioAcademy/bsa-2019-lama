using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Lama.Domain.BlobModels;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess.Interfaces;
using Lama.Domain.DbModels;
using System.Linq;
using Lama.Domain.DTO.Photo;
using AutoMapper;
using Lama.Domain.DTO.Reaction;
using Microsoft.AspNetCore.SignalR;
using Lama.BusinessLogic.Hubs;
using Lama.DataAccess;
using Lama.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;

namespace Lama.BusinessLogic.Services
{
    public class PhotoService : IPhotoService, IDisposable
    {
        // FIELDS
        private readonly string url;
        private readonly IUnitOfWork _context;
        private readonly HttpClient httpClient;
        private readonly IMapper _mapper;
        readonly INotificationService notificationService;
        readonly ApplicationDbContext Context;
        ILocationService locationService;
        private readonly IHubContext<NotificationHub> _hub;
        public PhotoService(ApplicationDbContext Context, string url, IUnitOfWork context, IMapper _mapper, INotificationService notificationService,ILocationService locationService, IHubContext<NotificationHub> hub)
        {
            this.url = url;
            _context = context;
            httpClient = new HttpClient();
            this._mapper = _mapper;
            this.Context = Context;
            this.locationService = locationService;
            this.notificationService = notificationService;
            _hub = hub;
        }


        public void Dispose()
        {
            this.httpClient.Dispose();
        }
        public async Task<IEnumerable<string>> GetHistory(int userId)
        {
            var history = await _context.GetRepository<SearchHistory>().GetAsync(h => h.UserId == userId);
            return history.Reverse()
                .GroupBy(h => h.Text)
                .Take(5)
                .Select(h => h.Take(5)
                    .First())
                .ToList()
                .Select(h => h.Text)
                .Distinct();
        }
        public async Task<IEnumerable<PhotoDocumentDTO>> FindPhoto(int id, string criteria)
        {

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/search/{id}/{criteria}");

            var responseContent = await response.Content.ReadAsStringAsync();

            var photoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photoDocumentDTOs = _mapper.Map<IEnumerable<PhotoDocumentDTO>>(photoDocuments);

            foreach (var photoDocumentDto in photoDocumentDTOs)
            {
                var likes = (await _context.GetRepository<Like>()
                    .GetAsync(l => l.PhotoId == photoDocumentDto.Id))


                    .ToArray();

                photoDocumentDto.Reactions = _mapper.Map<LikeDTO[]>(likes);

                foreach (var like in photoDocumentDto.Reactions)
                {
                    if (like.Photo != null)
                    {
                        like.Photo.Likes = null;
                    }
                }
            }
            await _context.GetRepository<SearchHistory>().InsertAsync(new SearchHistory
            {
                Text = criteria,
                UserId = id,
                SearchDate = DateTime.Now
            });
            await _context.SaveAsync();

            return photoDocumentDTOs;
        }

        public async Task<Dictionary<string, List<string>>> FindFields(int id, string criteria)
        {

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/search/fields/{id}/{criteria}");

            var responseContent = await response.Content.ReadAsStringAsync();


            return JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(responseContent);
        }

        public Task<int> Create(PhotoDocument item)
        {
            throw new NotImplementedException();
        }
        public async Task<int> AddReaction(NewLikeDTO newLike)
        {
            var like = _mapper.Map<Like>(newLike);
            await _context.GetRepository<Like>().InsertAsync(like);
            await _context.SaveAsync();

            var photo = await Context.Photos.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == newLike.PhotoId);
            var user = photo.User;
            var ID = user.Id;
            if (user.Id == newLike.UserId) return like.Id;
            {
                user = await Context.Users.FirstOrDefaultAsync(x => x.Id == newLike.UserId);
                var noti = "Liked your photo";
                await notificationService.SendNotification(ID, user, noti, ActivityType.Like, new List<int>() {photo.Id});
            }
            return like.Id;
        }
        public async Task RemoveReaction(NewLikeDTO removeLike)
        {
            var collect = await _context.GetRepository<Like>().GetAsync();
            var like = collect.FirstOrDefault(x => x.PhotoId == removeLike.PhotoId && x.UserId == removeLike.UserId);
            _context.GetRepository<Like>().Delete(like);
            await _context.SaveAsync();
        }

        public async Task<IEnumerable<UploadPhotoResultDTO>> CreateAll(CreatePhotoDTO[] photos)
        {
            var savedPhotos = new Photo[photos.Length];
            for (int i = 0; i < photos.Length; ++i)
            {
                var photo = new Photo();
                var user = await _context.GetRepository<User>().GetAsync(photos[i].AuthorId);
                photo.User = user;
                photo.UserId = photos[i].AuthorId;
                if (photos[i].ShortLocation != null)
                {
                    photo.LocationId = await locationService.CheckAdrress(photos[i].ShortLocation);
                }
                savedPhotos[i] = await _context.GetRepository<Photo>().InsertAsync(photo);
            }

            await _context.SaveAsync();

            var users = await _context.GetRepository<Photo>().GetAsync();

            // modify photos with ids
            for (int i = 0; i < photos.Length; ++i)
            {
                photos[i].Id = savedPhotos[i].Id;
            }

            // send photos to Photo project
            var content = new StringContent(JsonConvert.SerializeObject(photos), Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync($"{url}api/photos", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            var converted = JsonConvert.DeserializeObject<IEnumerable<UploadPhotoResultDTO>>(responseContent);
            foreach (var photo in converted)
            {
                photo.Reactions = new Like[0];
            }
            return converted;
        }

        public async Task<IEnumerable<UploadPhotoResultDTO>> CreateDuplicates(UploadPhotoResultDTO[] duplicates)
        {
            var content = new StringContent(JsonConvert.SerializeObject(duplicates), Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync($"{url}api/photos/duplicates", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            var converted = JsonConvert.DeserializeObject<IEnumerable<UploadPhotoResultDTO>>(responseContent);
            return converted;
        }

        public async Task<Photo> Create(CreatePhotoDTO item)
        {
            var insertedPhoto = (await _context.GetRepository<Photo>().InsertAsync(new Photo()));
            await _context.SaveAsync();

            // send request to Photo
            item.Id = insertedPhoto.Id;

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await httpClient.PostAsJsonAsync($"{url}api/photos", item);

            return response.IsSuccessStatusCode ? insertedPhoto : null;
        }

        public async Task<string> CreateAvatar(CreatePhotoDTO item)
        {
            var user = await _context.GetRepository<User>().GetAsync(item.AuthorId);
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await httpClient.PostAsJsonAsync($"{url}api/photos/avatar", item);
            var content = await response.Content.ReadAsStringAsync();
            user.AvatarUrl = JsonConvert.DeserializeObject<string>(content);
            await _context.SaveAsync();
            return user.AvatarUrl;
        }

        public async Task<UpdatedPhotoResultDTO> UpdatePhoto(UpdatePhotoDTO updatePhotoDTO)
        {
            var uri = $"{url}api/photos";

            var content = new StringContent(JsonConvert.SerializeObject(updatePhotoDTO), Encoding.UTF8, "application/json");

            var response = await httpClient.PutAsync(uri, content);

            var bodyJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<UpdatedPhotoResultDTO>(bodyJson);

        }

        public async Task SendDuplicates(IEnumerable<int> photos)
        {
            var userId = (await _context.GetRepository<Photo>().GetAsync(photos.FirstOrDefault())).UserId;
            await notificationService.SendNotification(userId, null, "Duplicates found", ActivityType.Duplicates, photos);
        }

        #region GET
        public async Task<IEnumerable<PhotoDocumentDTO>> GetAll()
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos");

            var responseContent = await response.Content.ReadAsStringAsync();

            var PhotoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photos = _mapper.Map<List<PhotoDocumentDTO>>(PhotoDocuments);

            if (photos == null)
            {
                return null;
            }

            for (int i = 0; i < photos.Count(); i++)
            {
                var getLike = await _context.GetRepository<Like>().GetAsync(x => x.PhotoId == photos[i].Id);
                photos[i].Reactions = _mapper.Map<IEnumerable<LikeDTO>>(getLike);
            }
            return photos;
        }

        public async Task<IEnumerable<UploadPhotoResultDTO>> GetDuplicates(int userId)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/duplicates/{userId}");

            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<IEnumerable<UploadPhotoResultDTO>>(responseContent);
        }

        public async Task<string> GetPhoto(string blobId)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/images/{blobId}");

            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<string>(responseContent);
        }

        public async Task<string> GetAvatar(string blobId)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/avatars/{blobId}");

            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<string>(responseContent);
        }

        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserPhotos(int id)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/user/{id}");

            var responseContent = await response.Content.ReadAsStringAsync();

            var PhotoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photos = _mapper.Map<List<PhotoDocumentDTO>>(PhotoDocuments);

            for (int i = 0; i < photos.Count(); i++)
            {
                var like = await _context.GetRepository<Like>().GetAsync(x => x.PhotoId == photos[i].Id);
                photos[i].Reactions = _mapper.Map<IEnumerable<LikeDTO>>(like);
            }
            return photos;
        }

        public async Task<PhotoDocumentDTO> Get(int id)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/{id}");

            var responseContent = await response.Content.ReadAsStringAsync();

            var photo =  JsonConvert.DeserializeObject<PhotoDocument>(responseContent);
            return _mapper.Map<PhotoDocumentDTO>(photo);
        }

        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserPhotosRange(int userId, int startId, int count)
        {
            var countPhotos = await _context.GetRepository<Photo>().CountAsync(x => x.User.Id == userId);
            httpClient.DefaultRequestHeaders.Add("userId", $"{userId}");
            httpClient.DefaultRequestHeaders.Add("startId", $"{startId}");
            httpClient.DefaultRequestHeaders.Add("count", $"{count}");

            var response = await httpClient.GetAsync($"{url}api/photos/rangeUserPhotos");

            var responseContent = await response.Content.ReadAsStringAsync();

            var PhotoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photos = _mapper.Map<List<PhotoDocumentDTO>>(PhotoDocuments);

            for (var i = 0; i < photos.Count(); i++)
            {
                var like = await _context.GetRepository<Like>().GetAsync(x => x.PhotoId == photos[i].Id);
                photos[i].Reactions = _mapper.Map<IEnumerable<LikeDTO>>(like);
            }
            return photos;
        }
        #endregion

        #region DELETE
        public Task MarkPhotoAsDeleted(int photoToDeleteId)
        {
            string uri = $"{url}api/photos/{photoToDeleteId}";

            return httpClient.DeleteAsync(uri);
        }
        public async Task<DeletedPhotoDTO[]> GetDeletedPhotos(int userId)
        {
            var uri = $"{url}api/photos/deleted/{userId}";

            var response = await httpClient.GetAsync(uri);

            var bodyJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<DeletedPhotoDTO[]>(bodyJson);
        }

        public async Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            var uri = $"{url}api/photos/delete_permanently";

            var content = new StringContent(JsonConvert.SerializeObject(photosToDelete), Encoding.UTF8, "application/json");

            await httpClient.PostAsync(uri, content);

            Photo haveLocation = null;
            int LocationId = 0;
            foreach (var photoToDelete in photosToDelete)
            {
                var phot = await Context.Photos.FirstOrDefaultAsync(x => x.Id == photoToDelete.Id);
                if(phot.LocationId.HasValue)
                {
                    LocationId = phot.LocationId.Value;
                }
                await _context.GetRepository<Photo>().DeleteAsync(photoToDelete.Id);
            }

            await _context.SaveAsync();
            haveLocation = await Context.Photos.FirstOrDefaultAsync(x => x.LocationId == LocationId);
            if (haveLocation == null)
            {
                if (LocationId != 0)
                {
                    await locationService.DeleteLocation(LocationId);
                }
            }
        }

        public Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            var uri = $"{url}api/photos/restore";

            var content = new StringContent(JsonConvert.SerializeObject(photosToRestore), Encoding.UTF8, "application/json");

            return httpClient.PostAsync(uri, content);
        }
        #endregion

    }
}
