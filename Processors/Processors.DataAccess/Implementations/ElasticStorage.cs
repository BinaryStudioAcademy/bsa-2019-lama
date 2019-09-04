using System.Collections.Generic;
using System.Threading.Tasks;
using Nest;
using Processors.Domain;
using Processors.Domain.BlobModel;
using Processors.Domain.DTO;

namespace Processors.DataAccess.Implementations
{
    public class ElasticStorage : Interfaces.IElasticStorage
    {
        private readonly string _indexName;
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
        
        public async Task<int> GetUserAsync(long imageId)
        {
            return (await _elasticClient.GetAsync<PhotoDocument>(imageId)).Source.UserId;
        }

        public async Task<string> GetCategoryAsync(long documentId)
        {
            return (await _elasticClient.GetAsync<PhotoDocument>(documentId)).Source.Category;
        }
        public async Task UpdateThumbnailsAsync(long id, ThumbnailUpdateDTO thumbnailUpdate)
        {
            await _elasticClient.UpdateAsync<PhotoDocument, object>(id, p => p.Doc(thumbnailUpdate));
        }
        public async Task UpdateHashAsync(long id, HashDTO hash)
        {
            await  _elasticClient.UpdateAsync<PhotoDocument, object>(id, p => p.Doc(hash));
        }
        public async Task<bool> ExistAsync(long id)
        {
            return (await _elasticClient.DocumentExistsAsync<PhotoDocument>(id)).Exists;
        }

        public async Task UpdateImageTagsAsync(long imageId, ImageTagsAsRaw imageTagsAsRaw)
        {
            await _elasticClient.UpdateAsync<PhotoDocument, object>(imageId, p => p.Doc(imageTagsAsRaw));
        }

        public async Task UpdateImageDescriptionAsync(long imageId, ImageDescriptionDTO imageDescription)
        {
            await _elasticClient.UpdateAsync<PhotoDocument, object>(imageId, p => p.Doc(imageDescription));
        }
        
        public async Task<IEnumerable<PhotoDocument>> GetUserPhotos(int userId)
        {
            var mustClauses = new List<QueryContainer>
            {
                new TermQuery {Field = Infer.Field<PhotoDocument>(p => p.IsDeleted), Value = false},
                new TermQuery {Field = Infer.Field<PhotoDocument>(t => t.UserId), Value = userId,},
                new MatchQuery {Field = Infer.Field<PhotoDocument>(p => p.BlobId), Query = ".*images.*"}
            };

            var searchRequest = new SearchRequest<PhotoDocument>(_indexName)
            {
                Size = 100,
                From = 0,
                Query = new BoolQuery { Must = mustClauses }
            };
            return (await _elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;
        }


    }
}
