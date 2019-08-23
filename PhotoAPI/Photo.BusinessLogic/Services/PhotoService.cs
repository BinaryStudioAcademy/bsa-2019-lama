using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Photo.Domain.BlobModels;
using Photo.BusinessLogic.Interfaces;
using Photo.DataAccess.Interfaces;
using Photo.Domain.DataTransferObjects;

using AutoMapper;
using System.IO;

namespace Photo.BusinessLogic.Services
{
    public class PhotoService : IPhotoService
    {
        // FIELDS
        private IElasticStorage elasticStorage;
        private IPhotoBlobStorage storage;
        private IMessageService messageService;
        private IMapper mapper;

        // CONSTRUCTORS
        public PhotoService(IElasticStorage elasticStorage, IPhotoBlobStorage storage, IMessageService messageService, IMapper mapper)
        {
            this.elasticStorage = elasticStorage;
            this.storage = storage;
            this.messageService = messageService;
            this.mapper = mapper;
        }

        public Task<IEnumerable<PhotoDocument>> Find(string criteria)
        {
            return elasticStorage.Find(criteria);
        }

        public async Task<List<Byte[]>> GetPhotos(PhotoDocument[] values)
        {
            return await storage.GetPhotos(values);
        }
        public async Task<string> GetPhoto (string blobId)
        {
            return await storage.GetPhoto(blobId);
        }

        public async Task<string> GetAvatar(string blobId)
        {
            return await storage.GetAvatar(blobId);
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
            string filename = Path.GetFileName(updatePhotoDTO.BlobId);
            string ext = Path.GetExtension(filename);
            string file = filename.Replace(ext, "");
            string base64 = ConvertToBase64(imageUrl: updatePhotoDTO.ImageBase64);
            byte[] newImageBlob = Convert.FromBase64String(base64);
            await DeleteOldBlobsAsync(elasticId: updatePhotoDTO.Id);
            string blobId = await storage.LoadPhotoToBlob(newImageBlob, $"{filename}");
            UpdatedPhotoResultDTO updatedPhoto = new UpdatedPhotoResultDTO
            {
                BlobId = blobId,
                Blob64Id = blobId,
                Blob256Id = blobId
            };
            await elasticStorage.UpdatePartiallyAsync(updatePhotoDTO.Id, updatedPhoto);
            messageService.SendPhotoToThumbnailProcessor(updatePhotoDTO.Id); 
            return updatedPhoto;
        }

        private async Task DeleteOldBlobsAsync(int elasticId)
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

        public async Task<IEnumerable<CreatePhotoResultDTO>> Create(CreatePhotoDTO[] items)
        {    
            var createdPhotos = new List<CreatePhotoResultDTO>();
            foreach(var item in items)
            {
                string base64 = ConvertToBase64(item.ImageUrl);
                byte[] blob = Convert.FromBase64String(base64);
                string blobId = await storage.LoadPhotoToBlob(blob);
                PhotoDocument photoDocumentToCreate = new PhotoDocument
                {
                    Id = item.Id,
                    Name = item.FileName,
                    BlobId = blobId,
                    Blob64Id = blobId,
                    Blob256Id = blobId,
                    OriginalBlobId = await storage.LoadPhotoToBlob(blob),
                    UserId = item.AuthorId,
                    Description = item.Description
                };

                await Create(photoDocumentToCreate);

                createdPhotos.Add(mapper.Map<CreatePhotoResultDTO>(photoDocumentToCreate));
                messageService.SendPhotoToThumbnailProcessor(photoDocumentToCreate.Id);
            }
            return createdPhotos;
        }

        public async Task<int> CreateAvatar(CreatePhotoDTO item)
        {
            string base64 = ConvertToBase64(item.ImageUrl);
            byte[] blob = Convert.FromBase64String(base64);
            string blobId = await storage.LoadAvatarToBlob(blob);
            await Create(new PhotoDocument
            {
                Id = item.Id,
                Name = Guid.NewGuid().ToString(),
                BlobId = blobId,
                Blob64Id = blobId,
                Blob256Id = blobId,
                OriginalBlobId = await storage.LoadAvatarToBlob(blob),
                UserId = item.AuthorId,
                Description = item.Description
            });
            messageService.SendAvatarToThumbnailProcessor(item.Id);
            return item.Id;
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

        public async Task<DeletedPhotoDTO[]> GetDeletedPhotos(int userId)
        {
            IEnumerable<PhotoDocument> searchResult = await elasticStorage.GetDeletedPhoto(userId);            
            
            return mapper.Map<DeletedPhotoDTO[]>(searchResult);
        }

        public async Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            // TODO: make this in single request
            foreach (PhotoToDeleteRestoreDTO deletePhoto in photosToDelete)
            {       
                await DeleteAllBlobsAsync(deletePhoto.Id);

                await elasticStorage.DeleteAsync(deletePhoto.Id);
            }
        }

        private async Task DeleteAllBlobsAsync(int elasticId)
        {
            PhotoDocument photoDocument = await this.Get(elasticId);

            await storage.DeleteFileAsync(photoDocument.BlobId);
            await storage.DeleteFileAsync(photoDocument.Blob64Id);
            await storage.DeleteFileAsync(photoDocument.Blob256Id);
            await storage.DeleteFileAsync(photoDocument.OriginalBlobId);
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
