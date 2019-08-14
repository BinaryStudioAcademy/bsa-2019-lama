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
        private IMapper mapper;

        // CONSTRUCTORS
        public PhotoService(IElasticStorage elasticStorage, IPhotoBlobStorage storage, IMapper mapper)
        {
            this.elasticStorage = elasticStorage;
            this.storage = storage;
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
            
            UpdatedPhotoResultDTO updatedPhoto = new UpdatedPhotoResultDTO
            {
                BlobId = await storage.LoadPhotoToBlob(newImageBlob, $"{filename}"),
                Blob64Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(newImageBlob, 64), $"{file}_64{ext}"),
                Blob256Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(newImageBlob, 256), $"{file}_256{ext}"),
            };

            await elasticStorage.UpdatePartiallyAsync(updatePhotoDTO.Id, updatedPhoto);

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
            CreatePhotoResultDTO[] createdPhotos = new CreatePhotoResultDTO[items.Length];

            for (int i = 0; i < items.Length; ++i)
            {
                string base64 = ConvertToBase64(items[i].ImageUrl);
                byte[] blob = Convert.FromBase64String(base64);
                var filename = items[i].FileName;
                var ext = Path.GetExtension(filename);
                string file = filename.Replace(ext, "");

                PhotoDocument photoDocumentToCreate = new PhotoDocument
                {
                    Id = items[i].Id,
                    Name = filename,
                    BlobId = await storage.LoadPhotoToBlob(blob, $"{file}{ext}"),
                    Blob64Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(blob, 64), $"{file}_64{ext}"),
                    Blob256Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(blob, 256), $"{file}_256{ext}"),
                    OriginalBlobId = await storage.LoadPhotoToBlob(blob, $"{file}_origin{ext}"),
                    UserId = items[i].AuthorId,
                    Description = items[i].Description
                };

                await Create(photoDocumentToCreate);

                createdPhotos[i] = mapper.Map<CreatePhotoResultDTO>(photoDocumentToCreate);
            }
            return createdPhotos;
        }

        public async Task<int> CreateAvatar(CreatePhotoDTO item)
        {
            string base64 = ConvertToBase64(item.ImageUrl);

            byte[] blob = Convert.FromBase64String(base64);

            await Create(new PhotoDocument
            {
                Id = item.Id,
                Name = Guid.NewGuid().ToString(),
                BlobId = await storage.LoadAvatarToBlob(blob),
                Blob64Id = await storage.LoadAvatarToBlob(ImageProcessingsService.CreateThumbnail(blob, 64)),
                Blob256Id = await storage.LoadAvatarToBlob(ImageProcessingsService.CreateThumbnail(blob, 256)),
                OriginalBlobId = await storage.LoadAvatarToBlob(blob),
                UserId = item.AuthorId,
                Description = item.Description
            });
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

        public async Task<DeletedPhotoDTO[]> GetDeletedPhotos()
        {
            IEnumerable<PhotoDocument> searchResult = await elasticStorage.GetDeletedPhoto();            
            
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
