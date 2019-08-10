using Nest;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Photo.Domain.BlobModels;
using Photo.BusinessLogic.Interfaces;
using Photo.DataAccess.Interfaces;

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
            return (await elasticClient.SearchAsync<PhotoDocument>()).Documents;
        }

        public async Task<PhotoDocument> Get(int blobId)
        {
            return (await elasticClient.GetAsync<PhotoDocument>(blobId)).Source;
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

        public Task Create(PhotoDocument item)
        {
            return elasticClient.CreateDocumentAsync(item);
        }

        public async Task<PhotoDocument> UpdateWithSharedLink(int id, string sharedLink)
        {
            //TODO: rewrite using elastic
            /*            var photoDocument = storage.Photos.Find(id);
                        if (photoDocument == null)
                        {
                            throw new NotFoundException(nameof(photoDocument), id);
                        }

                        photoDocument.SharedLink = sharedLink;

                        await _db.SaveChangesAsync();

                        return photoDocument;*/
            throw new NotImplementedException();
        }

        public async Task<int> Create(PhotoReceived item)
        {
            long lastId = elasticClient.Count<PhotoDocument>().Count;

            // TODO: get this with linq
            string base64;
                // TODO: change this to regex
            base64 = item.ImageUrl
                .Replace("data:image/jpeg;base64,", String.Empty)
                .Replace("data:image/png;base64,", String.Empty)
                .Replace("-", "+").Replace("_", "/");

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
            base64 = item.ImageUrl
                .Replace("data:image/jpeg;base64,", String.Empty)
                .Replace("data:image/png;base64,", String.Empty)
                .Replace("-", "+").Replace("_", "/");

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
    }
}
