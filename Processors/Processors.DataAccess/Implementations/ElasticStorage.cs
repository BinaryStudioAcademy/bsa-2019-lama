using Nest;

using Processors.Domain;
using Processors.Domain.BlobModel;

using System.Threading.Tasks;

namespace Processors.DataAccess.Implementation
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
        public Task UpdateThumbnailsAsync(long id, ThubnailUpdateDTO thumbnailUpdate)
        {
            return _elasticClient.UpdateAsync<PhotoDocument, object>(id, p => p.Doc(thumbnailUpdate));
        }
        public async Task<bool> ExistAsync(long id)
        {
            return (await _elasticClient.DocumentExistsAsync<PhotoDocument>(id)).Exists;
        }
    }
}
