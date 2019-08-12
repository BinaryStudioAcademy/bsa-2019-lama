using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Photo.Domain.BlobModels;
using Photo.BusinessLogic.Interfaces;
using Photo.DataAccess.Interfaces;
using Photo.Domain.DataTransferObjects;

using AutoMapper;

namespace Photo.BusinessLogic.Services
{
    public class PhotoService : IPhotoService
    {
        // FIELDS
        private IElasticStorage elasticStorage;
        private IPhotoBlobStorage storage;
        private IMapper mapper;

        // CONSTRUCTORS
        public PhotoService(IElasticStorage elasticStorage, IPhotoBlobStorage storage, IMapper mapper)
        {
            this.elasticStorage = elasticStorage;
            this.storage = storage;
            this.mapper = mapper;
        }

        // METHODS
        public Task<IEnumerable<PhotoDocument>> Get()
        {
            return elasticStorage.Get();
        }
        public Task<IEnumerable<PhotoDocument>> GetUserPhotos(int userId)
        {
            return elasticStorage.GetUserPhotos(userId);
        }
        public Task<PhotoDocument> Get(int elasticId)
        {
            return elasticStorage.Get(elasticId);
        }

        public async Task Delete(int id)
        {
            await elasticStorage.DeleteAsync(id);
            await DeleteAllBlobsAsync(id);
        }

        public async Task Update(PhotoDocument item)
        {
            await elasticStorage.UpdateAsync(item);
        }
        public async Task<UpdatedPhotoResultDTO> UpdateImage(UpdatePhotoDTO updatePhotoDTO)
        {
            string base64 = ConvertToBase64(imageUrl: updatePhotoDTO.ImageBase64);

            byte[] newImageBlob = Convert.FromBase64String(base64);


            await DeleteAllBlobsAsync(elasticId: updatePhotoDTO.Id);
            
            UpdatedPhotoResultDTO updatedPhoto = new UpdatedPhotoResultDTO
            {
                BlobId = await storage.LoadPhotoToBlob(newImageBlob),
                Blob64Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(newImageBlob, 64)),
                Blob256Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(newImageBlob, 256)),
            };

            await elasticStorage.UpdatePartiallyAsync(updatePhotoDTO.Id, updatedPhoto);

            return updatedPhoto;
        }
        private async Task DeleteAllBlobsAsync(int elasticId)
        {
            PhotoDocument photoDocument = await this.Get(elasticId);

            await storage.DeleteFileAsync(photoDocument.BlobId);
            await storage.DeleteFileAsync(photoDocument.Blob64Id);
            await storage.DeleteFileAsync(photoDocument.Blob256Id);
        }

        public Task Create(PhotoDocument item)
        {
            return elasticStorage.CreateAsync(item);
        }

        public async Task<PhotoDocument> UpdateWithSharedLink(int id, string sharedLink)
        {
            // TODO: figure out getting updated document without second request to elastic           
            
            var updateLinkObject = new { SharedLink = sharedLink };

            await elasticStorage.UpdatePartiallyAsync(id, updateLinkObject);

            return await elasticStorage.Get(id);
        }

        public async Task<IEnumerable<CreatePhotoResultDTO>> Create(PhotoReceived[] items)
        {
            // TODO: rewrite this
            long lastId = elasticStorage.GenerateId();
            
            CreatePhotoResultDTO[] createdPhotos = new CreatePhotoResultDTO[items.Length];
            for (int i = 0; i < items.Length; ++i)
            {
                string base64 = ConvertToBase64(items[i].ImageUrl);
                byte[] blob = Convert.FromBase64String(base64);

                PhotoDocument photoDocumentToCreate = new PhotoDocument
                {
                    Id = ++lastId,
                    BlobId = await storage.LoadPhotoToBlob(blob),
                    Blob64Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(blob, 64)),
                    Blob256Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(blob, 256)),
                    OriginalBlobId = await storage.LoadPhotoToBlob(blob),
                    UserId = items[i].AuthorId,
                    Description = items[i].Description
                };

                await Create(photoDocumentToCreate);

                createdPhotos[i] = mapper.Map<CreatePhotoResultDTO>(photoDocumentToCreate);
            }
            return createdPhotos;
        }

        public async Task<int> CreateAvatar(PhotoReceived item)
        {
            long lastId = elasticStorage.GenerateId();

            // TODO: get this with linq
            string base64;
            // TODO: change this to regex
            base64 = ConvertToBase64(item.ImageUrl);

            byte[] blob = Convert.FromBase64String(base64);

            await Create(new PhotoDocument
            {
                Id = lastId++,
                BlobId = await storage.LoadAvatarToBlob(blob),
                Blob64Id = await storage.LoadAvatarToBlob(ImageProcessingsService.CreateThumbnail(blob, 64)),
                Blob256Id = await storage.LoadAvatarToBlob(ImageProcessingsService.CreateThumbnail(blob, 256)),
                OriginalBlobId = await storage.LoadAvatarToBlob(blob),
                UserId = item.AuthorId,
                Description = item.Description
            });
            return (int)lastId;
        }
        private string ConvertToBase64(string imageUrl)
        {
            // TODO: change this to regex
            return imageUrl
                    .Replace("data:image/jpeg;base64,", String.Empty)
                    .Replace("data:image/png;base64,", String.Empty)
                    .Replace("-", "+").Replace("_", "/");
        }

        #region DELETE
        public Task MarkPhotoAsDeleted(int photoId)
        {
            var updateDeleteField = new { IsDeleted = true };

            return elasticStorage.UpdatePartiallyAsync(photoId, updateDeleteField);
        }

        public async Task<DeletedPhotoDTO[]> GetDeletedPhotos()
        {
            IEnumerable<PhotoDocument> searchResult = await elasticStorage.GetDeletedPhoto();            
            
            return mapper.Map<DeletedPhotoDTO[]>(searchResult);
        }

        public async Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            foreach (PhotoToDeleteRestoreDTO deletePhoto in photosToDelete)
            {
                // TODO: make this in single request
                await elasticStorage.DeleteAsync(deletePhoto.Id);

                await DeleteAllBlobsAsync(deletePhoto.Id);
            }
        }

        public async Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            // TODO: make this in single request
            foreach (PhotoToDeleteRestoreDTO restorePhoto in photosToRestore)
            {
                var updateDeleteField = new { IsDeleted = false };

                await elasticStorage.UpdatePartiallyAsync(restorePhoto.Id, updateDeleteField);
            }
        }
        #endregion
    }


}
