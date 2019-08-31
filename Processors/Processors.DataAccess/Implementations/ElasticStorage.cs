using System.Threading.Tasks;
using Nest;
using Processors.Domain;
using Processors.Domain.BlobModel;
using Processors.Domain.DTO;

namespace Processors.DataAccess.Implementations
{
    public class ElasticStorage : Interfaces.IElasticStorage
    {
        private string _indexName;
        private readonly IElasticClient _elasticClient;

        public ElasticStorage(string indexName, IElasticClient elasticClient)
        {
            _indexName = indexName;
            _elasticClient = elasticClient;
        }

        public async Task<string> GetBlobId(long documentId)
        {
            return (await _elasticClient.GetAsync<PhotoDocument>(documentId)).Source.BlobId;
        }
        public Task UpdateThumbnailsAsync(long id, ThumbnailUpdateDTO thumbnailUpdate)
        {
            return _elasticClient.UpdateAsync<PhotoDocument, object>(id, p => p.Doc(thumbnailUpdate));
        }
        public Task UpdateHashAsync(long id, HasDTO has)
        {
            return _elasticClient.UpdateAsync<PhotoDocument, object>(id, p => p.Doc(has));
        }
        public async Task<bool> ExistAsync(long id)
        {
            return (await _elasticClient.DocumentExistsAsync<PhotoDocument>(id)).Exists;
        }

        public Task UpdateImageTagsAsync(long imageId, ImageTagsAsRaw imageTagsAsRaw)
        {
            return _elasticClient.UpdateAsync<PhotoDocument, object>(imageId, p => p.Doc(imageTagsAsRaw));
        }
    }
}
