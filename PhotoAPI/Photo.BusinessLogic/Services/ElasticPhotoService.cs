using Nest;
using System;
using System.Collections.Generic;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Elasticsearch.Net;
using Newtonsoft.Json;

using Photo.Domain.BlobModels;
using Photo.BusinessLogic.Interfaces;
using Photo.DataAccess.Interfaces;
using Photo.Domain.DataTransferObjects;

using AutoMapper;

namespace Photo.BusinessLogic.Services
{
    public class ElasticPhotoService : IPhotoService
    {
        // FIELDS
        private string indexName;
        private IPhotoBlobStorage storage;
        private IElasticClient elasticClient;
        private IMapper mapper;

        // CONSTRUCTORS
        public ElasticPhotoService(string indexName, IElasticClient elasticClient, IPhotoBlobStorage storage, IMapper mapper)
        {
            this.indexName = indexName;
            this.elasticClient = elasticClient;
            this.storage = storage;
            this.mapper = mapper;
        }

        // METHODS
        public async Task<IEnumerable<PhotoDocument>> Get()
        {
            var mustClauses = new List<QueryContainer>();

            mustClauses.Add(new TermQuery
            {
                Field = Infer.Field<PhotoDocument>(p => p.IsDeleted),
                Value = false
            });

            mustClauses.Add(new MatchQuery
            {
                Field = Infer.Field<PhotoDocument>(p => p.BlobId),
                Query = ".*images.*"
            });

            var searchRequest = new SearchRequest<PhotoDocument>(indexName)
            {
                Size = 100,
                From = 0,
                Query = new BoolQuery { Must = mustClauses }
            };
            return (await elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;
        }
        public async Task<PhotoDocument> Get(int elasticId)
        {
            return (await elasticClient.GetAsync<PhotoDocument>(elasticId)).Source;
        }

        public async Task Delete(int id)
        {
            await elasticClient.DeleteAsync<PhotoDocument>(id);
            await DeleteAllBlobsAsync(id);
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
            // updateResponse.Get.Source returns NRE 
            //TODO: figure out getting updated document without second request to elastic
            
            
            var updateLinkObject = new { SharedLink = sharedLink };

            UpdateResponse<PhotoDocument> updateResponse 
                = await elasticClient.UpdateAsync<PhotoDocument, object>(id, p => p.Doc(updateLinkObject));

            var getUpdatedDocument = await elasticClient.GetAsync<PhotoDocument>(id);
            var updatedDocument = getUpdatedDocument.Source;

            return updatedDocument;
        }

        public async Task<IEnumerable<int>> Create(PhotoReceived[] items)
        {
            // TODO: rewrite this
            var result = elasticClient.Search<PhotoDocument>(s => s
               .Aggregations(a => a
                   .Max("id", m => m
                       .Field(p => p.Id)
                   )
               )
           );
            var agg = result.Aggregations.Max("id").Value;
            long lastId = ((long)agg.Value) + 1;

            List<int> ids = new List<int>();
            foreach (var item in items)
            {
                string base64 = ConvertToBase64(item.ImageUrl);
                byte[] blob = Convert.FromBase64String(base64);

                await Create(new PhotoDocument
                {
                    Id = lastId++,
                    BlobId = await storage.LoadPhotoToBlob(blob),
                    Blob64Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(blob, 64)),
                    Blob256Id = await storage.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(blob, 256)),
                    OriginalBlobId = await storage.LoadPhotoToBlob(blob),
                    UserId = item.AuthorId,
                    Description = item.Description
                });
                ids.Add((int)lastId);
            }
            return ids;
        }

        public async Task<int> CreateAvatar(PhotoReceived item)
        {
            var result = elasticClient.Search<PhotoDocument>(s => s
               .Aggregations(a => a
                   .Max("id", m => m
                       .Field(p => p.Id)
                   )
               )
           );
            var agg = result.Aggregations.Max("id").Value;
            long lastId = ((long)agg.Value) + 1;

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

            return elasticClient.UpdateAsync<PhotoDocument, object>(photoId, p => p.Doc(updateDeleteField));
        }

        public async Task<DeletedPhotoDTO[]> GetDeletedPhotos()
        {
            SearchRequest<PhotoDocument> searchRequest = new SearchRequest<PhotoDocument>
            {
                Query = new TermQuery
                {
                    Field = Infer.Field<PhotoDocument>(p => p.IsDeleted),
                    Value = true
                },
                // TODO: select only needed fields
                /*
                StoredFields = Infer.Fields<PhotoDocument>()
                    .And<PhotoDocument>(p => p.Id)
                    .And<PhotoDocument>(p => p.Blob256Id)
                    */
            };

            IEnumerable<PhotoDocument> searchResult = (await elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;            
            
            return mapper.Map<DeletedPhotoDTO[]>(searchResult);
        }

        public async Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            foreach (PhotoToDeleteRestoreDTO deletePhoto in photosToDelete)
            {
                // TODO: make this in single request
                await elasticClient.DeleteAsync<PhotoDocument>(deletePhoto.Id);

                await DeleteAllBlobsAsync(deletePhoto.Id);
            }
        }

        public async Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            // TODO: make this in single request
            foreach (PhotoToDeleteRestoreDTO restorePhoto in photosToRestore)
            {
                var updateDeleteField = new { IsDeleted = false };

                await elasticClient.UpdateAsync<PhotoDocument, object>(restorePhoto.Id, p => p.Doc(updateDeleteField));
            }
        }
        #endregion
    }


}
