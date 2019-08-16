﻿using System;
using System.Collections.Generic;
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
        private string v;
        private IUnitOfWork unitOfWork;
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

        public async Task<IEnumerable<UploadPhotoResultDTO>> FindPhoto(string criteria)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/search/{criteria}");

            var responseContent = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<IEnumerable<UploadPhotoResultDTO>>(responseContent);
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
            var like = collect.Where(x => x.PhotoId == removeLike.PhotoId && x.UserId == removeLike.UserId).FirstOrDefault();
            _context.GetRepository<Like>().Delete(like);
            await _context.SaveAsync();
        }
        public async Task<IEnumerable<UploadPhotoResultDTO>> CreateAll(CreatePhotoDTO[] photos)
        {
            Photo[] savedPhotos = new Photo[photos.Length];
            for (int i = 0; i < photos.Length; ++i)
            {
                savedPhotos[i] = await _context.GetRepository<Photo>().InsertAsync(new Photo());
            }
            await _context.SaveAsync();

            // modify photos with ids
            for (int i = 0; i < photos.Length; ++i)
            {
                photos[i].Id = savedPhotos[i].Id;
            }

            // send photos to Photo project
            StringContent content = new StringContent(JsonConvert.SerializeObject(photos), Encoding.UTF8, "application/json");
            var response = await httpClient.PostAsync($"{url}api/photos", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<UploadPhotoResultDTO[]>(responseContent);
        }
        
        public async Task<Photo> Create(CreatePhotoDTO item)
        {
            Photo insertedPhoto = (await _context.GetRepository<Photo>().InsertAsync(new Photo ()));
            await _context.SaveAsync();

            // send request to Photo
            item.Id = insertedPhoto.Id;

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await httpClient.PostAsJsonAsync($"{url}api/photos", item);

            return response.IsSuccessStatusCode ? insertedPhoto : null;
        }

        public async Task<Photo> CreateAvatar(CreatePhotoDTO item)
        {
            // save
            Photo insertedPhoto = await _context.GetRepository<Photo>().InsertAsync(new Photo());
            await _context.SaveAsync();

            item.Id = insertedPhoto.Id;
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await httpClient.PostAsJsonAsync($"{url}api/photos/avatar", item);

            return response.IsSuccessStatusCode ? insertedPhoto : null;
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
  
            for (int i = 0; i < photos.Count() ; i++)
            {
                var getLike = await _context.GetRepository<Like>().GetAsync(x => x.PhotoId == photos[i].Id);
                photos[i].Reactions = _mapper.Map<IEnumerable<Domain.DTO.LikeDTO>>(getLike);
            }
            return photos;
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
                photos[i].Reactions = _mapper.Map<IEnumerable<Domain.DTO.LikeDTO>>(like);
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
        #endregion

        #region DELETE
        public Task MarkPhotoAsDeleted(int photoToDeleteId)
        {
            string uri = $"{url}api/photos/{photoToDeleteId}";

            return httpClient.DeleteAsync(uri);
        }
        public async Task<DeletedPhotoDTO[]> GetDeletedPhotos()
        {
            string uri = $"{url}api/photos/deleted";

            HttpResponseMessage response = await httpClient.GetAsync(uri);

            string bodyJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<DeletedPhotoDTO[]>(bodyJson);
        }

        public async Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            string uri = $"{url}api/photos/delete_permanently";

            StringContent content = new StringContent(JsonConvert.SerializeObject(photosToDelete), Encoding.UTF8, "application/json");

            await httpClient.PostAsync(uri, content);

            foreach (PhotoToDeleteRestoreDTO photoToDelete in photosToDelete)
            {
                await _context.GetRepository<Photo>().DeleteAsync(photoToDelete.Id);
            }
            
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
