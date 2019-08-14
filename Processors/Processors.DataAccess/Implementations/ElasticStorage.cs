using Nest;

using Processors.Domain;
using Processors.Domain.BlobModel;

using System.Threading.Tasks;

namespace Processors.DataAccess.Implementation
{
    public class ElasticStorage : Interfaces.IElasticStorage
    {
        // FIELDS
        string indexName;
        IElasticClient elasticClient;

        // CONSTRUCTORS
        public ElasticStorage(string indexName, IElasticClient elasticClient)
        {
            this.indexName = indexName;
            this.elasticClient = elasticClient;
        }

        // METHODS
        public async Task<string> GetBlobId(long documentId)
        {
            return (await elasticClient.GetAsync<PhotoDocument>(documentId)).Source.BlobId;
        }
        public Task UpdateThumbnailsAsync(long id, ThubnailUpdateDTO thubnailUpdate)
        {
            return elasticClient.UpdateAsync<PhotoDocument, object>(id, p => p.Doc(thubnailUpdate));
        }
        public async Task<bool> ExistAsync(long id)
        {
            return (await elasticClient.DocumentExistsAsync<PhotoDocument>(id)).Exists;
        }
    }
}
