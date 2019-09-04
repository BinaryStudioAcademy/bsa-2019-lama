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
using Microsoft.EntityFrameworkCore;

namespace Lama.BusinessLogic.Services
{
    public class PhotoService : IPhotoService, IDisposable
    {
        private readonly string _url;
        private readonly IUnitOfWork _unitOfWorkContext;
        private readonly HttpClient _httpClient;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        private readonly ApplicationDbContext _dbContext;
        public PhotoService(ApplicationDbContext dbContext, string url, IUnitOfWork unitOfWorkContext, IMapper mapper, INotificationService notificationService)
        {
            _url = url;
            _unitOfWorkContext = unitOfWorkContext;
            _httpClient = new HttpClient();
            _mapper = mapper;
            _dbContext = dbContext;
            _notificationService = notificationService;
        }


        public void Dispose()
        {
            _httpClient.Dispose();
        }
        public async Task<IEnumerable<string>> GetHistory(int userId)
        {
            var history = await _unitOfWorkContext.GetRepository<SearchHistory>().GetAsync(h => h.UserId == userId);
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

            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/search/{id}/{criteria}");

            var responseContent = await response.Content.ReadAsStringAsync();

            var photoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photoDocumentDTOs = _mapper.Map<IEnumerable<PhotoDocumentDTO>>(photoDocuments);

            foreach (var photoDocumentDto in photoDocumentDTOs)
            {
                var likes =  (await _unitOfWorkContext.GetRepository<Like>()
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
            await _unitOfWorkContext.GetRepository<SearchHistory>().InsertAsync(new SearchHistory
            {
                Text = criteria,
                UserId = id,
                SearchDate = DateTime.Now
            });
            await _unitOfWorkContext.SaveAsync();

            return photoDocumentDTOs;
        }

        public async Task<Dictionary<string, List<string>>> FindFields(int id, string criteria)
        {

            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/search/fields/{id}/{criteria}");

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
            await _unitOfWorkContext.GetRepository<Like>().InsertAsync(like);
            await _unitOfWorkContext.SaveAsync();

            var photo = await _dbContext.Photos.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == newLike.PhotoId);
            var user = photo.User;
            var ID = user.Id;
            if (user.Id == newLike.UserId) return like.Id;
            {
                user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == newLike.UserId);
                var noti = "Liked your photo";
                await _notificationService.SendNotification(ID, user, noti);
            }
            return like.Id;
        }
        public async Task RemoveReaction(NewLikeDTO removeLike)
        {
            var collect = await _unitOfWorkContext.GetRepository<Like>().GetAsync();
            var like = collect.FirstOrDefault(x => x.PhotoId == removeLike.PhotoId && x.UserId == removeLike.UserId);
            _unitOfWorkContext.GetRepository<Like>().Delete(like);
            await _unitOfWorkContext.SaveAsync();
        }

        public async Task<IEnumerable<UploadPhotoResultDTO>> CreateAll(CreatePhotoDTO[] photos)
        {
            var savedPhotos = new Photo[photos.Length];
            for (var i = 0; i < photos.Length; ++i)
            {
                var photo = new Photo();
                var user = await _unitOfWorkContext.GetRepository<User>().GetAsync(photos[i].AuthorId);
                photo.User = user;
                photo.UserId = photos[i].AuthorId;
                //user.Photos.Add(photo);
                savedPhotos[i] = await _unitOfWorkContext.GetRepository<Photo>().InsertAsync(photo);
            }

            await _unitOfWorkContext.SaveAsync();

            var users = await _unitOfWorkContext.GetRepository<Photo>().GetAsync();

            // modify photos with ids
            for (int i = 0; i < photos.Length; ++i)
            {
                photos[i].Id = savedPhotos[i].Id;
            }

            // send photos to Photo project
            var content = new StringContent(JsonConvert.SerializeObject(photos), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"{_url}api/photos", content);
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
            var response = await _httpClient.PostAsync($"{_url}api/photos/duplicates", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            var converted = JsonConvert.DeserializeObject<IEnumerable<UploadPhotoResultDTO>>(responseContent);
            return converted;
        }

        public async Task<Photo> Create(CreatePhotoDTO item)
        {
            var insertedPhoto = (await _unitOfWorkContext.GetRepository<Photo>().InsertAsync(new Photo()));
            await _unitOfWorkContext.SaveAsync();

            // send request to Photo
            item.Id = insertedPhoto.Id;

            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await _httpClient.PostAsJsonAsync($"{_url}api/photos", item);

            return response.IsSuccessStatusCode ? insertedPhoto : null;
        }

        public async Task<string> CreateAvatar(CreatePhotoDTO item)
        {
            var user = await _unitOfWorkContext.GetRepository<User>().GetAsync(item.AuthorId);
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await _httpClient.PostAsJsonAsync($"{_url}api/photos/avatar", item);
            var content = await response.Content.ReadAsStringAsync();
            user.AvatarUrl = JsonConvert.DeserializeObject<string>(content);
            await _unitOfWorkContext.SaveAsync();
            return user.AvatarUrl;
        }

        public async Task<UpdatedPhotoResultDTO> UpdatePhoto(UpdatePhotoDTO updatePhotoDTO)
        {
            var uri = $"{_url}api/photos";

            var content = new StringContent(JsonConvert.SerializeObject(updatePhotoDTO), Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync(uri, content);

            var bodyJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<UpdatedPhotoResultDTO>(bodyJson);

        }

        #region GET
        public async Task<IEnumerable<PhotoDocumentDTO>> GetAll()
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos");

            var responseContent = await response.Content.ReadAsStringAsync();

            var PhotoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photos = _mapper.Map<List<PhotoDocumentDTO>>(PhotoDocuments);

            if (photos == null)
            {
                return null;
            }

            for (int i = 0; i < photos.Count(); i++)
            {
                var getLike = await _unitOfWorkContext.GetRepository<Like>().GetAsync(x => x.PhotoId == photos[i].Id);
                photos[i].Reactions = _mapper.Map<IEnumerable<LikeDTO>>(getLike);
            }
            return photos;
        }

        public async Task<IEnumerable<UploadPhotoResultDTO>> GetDuplicates(int userId)
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/duplicates/{userId}");

            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<IEnumerable<UploadPhotoResultDTO>>(responseContent);
        }

        public async Task<string> GetPhoto(string blobId)
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/images/{blobId}");

            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<string>(responseContent);
        }

        public async Task<string> GetAvatar(string blobId)
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/avatars/{blobId}");

            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<string>(responseContent);
        }

        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserPhotos(int id)
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/user/{id}");

            var responseContent = await response.Content.ReadAsStringAsync();

            var PhotoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photos = _mapper.Map<List<PhotoDocumentDTO>>(PhotoDocuments);

            for (int i = 0; i < photos.Count(); i++)
            {
                var like = await _unitOfWorkContext.GetRepository<Like>().GetAsync(x => x.PhotoId == photos[i].Id);
                photos[i].Reactions = _mapper.Map<IEnumerable<LikeDTO>>(like);
            }
            return photos;
        }

        public async Task<PhotoDocument> Get(int id)
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/{id}");

            var responseContent = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<PhotoDocument>(responseContent);
        }

        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserPhotosRange(int userId, int startId, int count)
        {
            var countPhotos = await _unitOfWorkContext.GetRepository<Photo>().CountAsync(x => x.User.Id == userId);
            _httpClient.DefaultRequestHeaders.Add("userId", $"{userId}");
            _httpClient.DefaultRequestHeaders.Add("startId", $"{startId}");
            _httpClient.DefaultRequestHeaders.Add("count", $"{count}");

            var response = await _httpClient.GetAsync($"{_url}api/photos/rangeUserPhotos");

            var responseContent = await response.Content.ReadAsStringAsync();

            var PhotoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photos = _mapper.Map<List<PhotoDocumentDTO>>(PhotoDocuments);

            for (var i = 0; i < photos.Count(); i++)
            {
                var like = await _unitOfWorkContext.GetRepository<Like>().GetAsync(x => x.PhotoId == photos[i].Id);
                photos[i].Reactions = _mapper.Map<IEnumerable<LikeDTO>>(like);
            }
            return photos;
        }
        #endregion

        #region DELETE
        public Task MarkPhotoAsDeleted(int photoToDeleteId)
        {
            string uri = $"{_url}api/photos/{photoToDeleteId}";

            return _httpClient.DeleteAsync(uri);
        }
        public async Task<DeletedPhotoDTO[]> GetDeletedPhotos(int userId)
        {
            var uri = $"{_url}api/photos/deleted/{userId}";

            var response = await _httpClient.GetAsync(uri);

            var bodyJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<DeletedPhotoDTO[]>(bodyJson);
        }

        public async Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            var uri = $"{_url}api/photos/delete_permanently";

            var content = new StringContent(JsonConvert.SerializeObject(photosToDelete), Encoding.UTF8, "application/json");

            await _httpClient.PostAsync(uri, content);

            foreach (var photoToDelete in photosToDelete)
            {
                await _unitOfWorkContext.GetRepository<Photo>().DeleteAsync(photoToDelete.Id);
            }

            await _unitOfWorkContext.SaveAsync();
        }

        public Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            var uri = $"{_url}api/photos/restore";

            var content = new StringContent(JsonConvert.SerializeObject(photosToRestore), Encoding.UTF8, "application/json");

            return _httpClient.PostAsync(uri, content);
        }
        #endregion

    }
}
