using Nest;

using Photo.DataAccess.Interfaces;
using Photo.Domain.BlobModels;

using System.Collections.Generic;
using System.Threading.Tasks;

namespace Photo.DataAccess.Implementation
{
    public class ElasticStorage : IElasticStorage
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
        public Task CreateAsync(PhotoDocument item)
        {
            return elasticClient.CreateDocumentAsync(item);
        }

        public Task CreateAsync(int id, PhotoDocument item)
        {
            item.Id = id;
            return elasticClient.CreateDocumentAsync(item);
        }

        public async Task DeleteAsync(int id)
        {
            await elasticClient.DeleteAsync<PhotoDocument>(id);
        }

        public async Task UpdateAsync(PhotoDocument item)
        {
            await elasticClient.UpdateAsync(
                new DocumentPath<PhotoDocument>(item),
         
                u => u.Index(indexName).Doc(item));
        }

        public async Task UpdatePartiallyAsync(int id, object partialObject)
        {
            await elasticClient.UpdateAsync<PhotoDocument, object>(id, p => p.Doc(partialObject));
        }
        public async Task UpdatePartiallyAsync<TPartialObject>(int id, TPartialObject partialObject)
            where TPartialObject : class
        {
            await elasticClient.UpdateAsync<PhotoDocument, TPartialObject>(id, p => p.Doc(partialObject));
        }

        #region GET
        public async Task<PhotoDocument> Get(int elasticId)
        {
            return (await elasticClient.GetAsync<PhotoDocument>(elasticId)).Source;
        }
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
                Query = new BoolQuery { Must = mustClauses },
                Sort = new List<ISort>
                {
                    new FieldSort
                    {
                        Field = Infer.Field<PhotoDocument>(p => p.Id),
                        Order = SortOrder.Descending
                    }
                }
            };
            return (await elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;
        }

        public async Task<IEnumerable<PhotoDocument>> Find(string criteria)
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

            mustClauses.Add(new WildcardQuery
            {
                Field = Infer.Field<PhotoDocument>(p => p.Description),
                Value = $"*{criteria}*"
            });

            var searchRequest = new SearchRequest<PhotoDocument>(indexName)
            {
                Size = 100,
                From = 0,
                Query = new BoolQuery { Must = mustClauses }
            };
            return (await elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;
        }

        public async Task<IEnumerable<PhotoDocument>> GetDeletedPhoto()
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

           return (await elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;
        }

        public async Task<IEnumerable<PhotoDocument>> GetUserPhotos(int userId)
        {
            var mustClauses = new List<QueryContainer>();

            mustClauses.Add(new TermQuery
            {
                Field = Infer.Field<PhotoDocument>(p => p.IsDeleted),
                Value = false
            });
            
            mustClauses.Add(new TermQuery
            {
                Field = Infer.Field<PhotoDocument>(t => t.UserId),
                Value = userId,
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
        #endregion
    }
}
