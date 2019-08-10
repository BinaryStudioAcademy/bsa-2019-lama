using Nest;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Photo.Domain.BlobModels;
using Photo.BusinessLogic.Interfaces;
using Photo.DataAccess.Interfaces;
using Photo.Domain.DataTransferObjects;

namespace Photo.BusinessLogic.Services
{
    public class ElasticPhotoService : IPhotoService
    {
        // FIELDS
        private string indexName;
        private IPhotoBlobStorage storage;
        private IElasticClient elasticClient;

        // CONSTRUCTORS
        public ElasticPhotoService(string indexName, IElasticClient elasticClient, IPhotoBlobStorage storage)
        {
            this.indexName = indexName;
            this.elasticClient = elasticClient;
            this.storage = storage;
        }

        // METHODS
        public async Task<IEnumerable<PhotoDocument>> Get()
        {
            //return (await elasticClient.SearchAsync<PhotoDocument>()).Documents;
            return (await elasticClient.SearchAsync<PhotoDocument>(p => p
            .Query(s => s
            .Match(i => i
            .Field(f => f.BlobId)
                .Query(".*images.*"))))).Documents/*.Documents*/;


        }

        public async Task<PhotoDocument> Get(int elasticId)
        {
            return (await elasticClient.GetAsync<PhotoDocument>(elasticId)).Source;
        }

        public async Task Delete(int id)
        {
            await elasticClient.DeleteAsync<PhotoDocument>(id);
        }

        public async Task Update(PhotoDocument item)
        {
            await elasticClient.UpdateAsync(
                new DocumentPath<PhotoDocument>(item),
                u => u.Index(indexName).Doc(item));
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

            await elasticClient.UpdateAsync<PhotoDocument, UpdatedPhotoResultDTO>(updatePhotoDTO.Id, p => p.Doc(updatedPhoto));

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
            return elasticClient.CreateDocumentAsync(item);
        }

        public async Task<PhotoDocument> UpdateWithSharedLink(int id, string sharedLink)
        {
            // TODO: rewrite using elastic
            // TODO: check if this work
            var updateLinkObject = new { SharedLink = sharedLink };

            UpdateResponse<PhotoDocument> updateResponse 
                = await elasticClient.UpdateAsync<PhotoDocument, object>(id, p => p.Doc(updateLinkObject));

            return updateResponse.Get.Source;
        }

        public async Task<int> Create(PhotoReceived item)
        {
            // TODO: rewrite this
            long lastId = elasticClient.Count<PhotoDocument>().Count;      
            
            string base64 = ConvertToBase64(item.ImageUrl);

            byte[] blob = Convert.FromBase64String(base64);

            await Create(new PhotoDocument
            {
                Id = lastId++,
                BlobId = await storage.LoadPhotoToBlob(blob),
                Blob64Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(blob, 64)),
                Blob256Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(blob, 256)),
                UserId = item.AuthorId,
                Description = item.Description
            });
            return (int)lastId;
        }

        public async Task<int> CreateAvatar(PhotoReceived item)
        {
            long lastId = elasticClient.Count<PhotoDocument>().Count;

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
    }
}
