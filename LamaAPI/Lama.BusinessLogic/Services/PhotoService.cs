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

namespace Lama.BusinessLogic.Services
{
    public class PhotoService : IPhotoService, IDisposable
    {
        // FIELDS
        private string url;
        private IUnitOfWork _context;
        private HttpClient httpClient;
        private readonly IMapper _mapper;
        public PhotoService(string url, IUnitOfWork context, IMapper _mapper)
        {
            this.url = url;
            _context = context;
            httpClient = new HttpClient();
            this._mapper = _mapper;
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

            IEnumerable<PhotoDocumentDTO> photoDocumentDTOs = JsonConvert.DeserializeObject<IEnumerable<PhotoDocumentDTO>>(responseContent);

            foreach (PhotoDocumentDTO photoDocumentDTO in photoDocumentDTOs)
            {
                Like[] likes = (await _context.GetRepository<Like>()
                    .GetAsync(l => l.PhotoId == photoDocumentDTO.Id))
                    .ToArray();

                photoDocumentDTO.Reactions = _mapper.Map<LikeDTO[]>(likes);

                foreach (LikeDTO like in photoDocumentDTO.Reactions)
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

        // METHODS
        #region CREATE
        public Task<int> Create(PhotoDocument item)
        {
            throw new NotImplementedException();
        }
        public async Task<int> AddReaction(NewLikeDTO newLike)
        {
            var like = _mapper.Map<Like>(newLike);
            await _context.GetRepository<Like>().InsertAsync(like);
            await _context.SaveAsync();

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
                //user.Photos.Add(photo);
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

        #endregion

        public async Task<UpdatedPhotoResultDTO> UpdatePhoto(UpdatePhotoDTO updatePhotoDTO)
        {
            string uri = $"{url}api/photos";

            StringContent content = new StringContent(JsonConvert.SerializeObject(updatePhotoDTO), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await httpClient.PutAsync(uri, content);

            string bodyJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<UpdatedPhotoResultDTO>(bodyJson);

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

        public async Task<PhotoDocument> Get(int id)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/{id}");

            var responseContent = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<PhotoDocument>(responseContent);
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

            for (int i = 0; i < photos.Count(); i++)
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
            string uri = $"{url}api/photos/deleted/{userId}";

            HttpResponseMessage response = await httpClient.GetAsync(uri);

            string bodyJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<DeletedPhotoDTO[]>(bodyJson);
        }

        public async Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            string uri = $"{url}api/photos/delete_permanently";

            var content = new StringContent(JsonConvert.SerializeObject(photosToDelete), Encoding.UTF8, "application/json");

            await httpClient.PostAsync(uri, content);

            foreach (var photoToDelete in photosToDelete)
            {
                await _context.GetRepository<Photo>().DeleteAsync(photoToDelete.Id);
            }

            await _context.SaveAsync();
        }

        public Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            string uri = $"{url}api/photos/restore";

            StringContent content = new StringContent(JsonConvert.SerializeObject(photosToRestore), Encoding.UTF8, "application/json");

            return httpClient.PostAsync(uri, content);
        }
        #endregion

    }
}
