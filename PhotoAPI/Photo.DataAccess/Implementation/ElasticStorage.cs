using Nest;
using Photo.DataAccess.Interfaces;
using Photo.Domain.BlobModels;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.IO;

namespace Photo.DataAccess.Implementation
{
    public class ElasticStorage : IElasticStorage
    {
        private readonly string _indexName;
        private readonly IElasticClient _elasticClient;

        public ElasticStorage(string indexName, IElasticClient elasticClient)
        {
            _indexName = indexName;
            _elasticClient = elasticClient;
        }
        public async Task<int> CheckUserPhoto(Tuple<int, int> tuple)
        {
            var mustClauses = new List<QueryContainer>
            {
                new TermQuery {Field = Infer.Field<PhotoDocument>(t => t.Id), Value = tuple.Item2,},
                new TermQuery {Field = Infer.Field<PhotoDocument>(t => t.UserId), Value = tuple.Item1,}
            };

            var searchRequest = new SearchRequest<PhotoDocument>(_indexName)
            {
                Size = 100,
                From = 0,
                Query = new BoolQuery { Must = mustClauses }
            };

            var searchedDocuments = (await _elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;
            if (searchedDocuments.Count != 0) return tuple.Item1;
            var doc = await Get(tuple.Item2);
            return doc.UserId;
        }
        
        public async Task<CreateResponse> CreateAsync(PhotoDocument item)
        {
            return await _elasticClient.CreateDocumentAsync(item);
        }

        public async Task<CreateResponse> CreateAsync(int id, PhotoDocument item)
        {
            item.Id = id;
            return await _elasticClient.CreateDocumentAsync(item);
        }

        public async Task DeleteAsync(int id)
        {
            await _elasticClient.DeleteAsync<PhotoDocument>(id);
        }

        public async Task UpdateAsync(PhotoDocument item)
        {
            await _elasticClient.UpdateAsync(
                new DocumentPath<PhotoDocument>(item),

                u => u.Index(_indexName).Doc(item));
        }

        public async Task UpdatePartiallyAsync(int id, object partialObject)
        {
            await _elasticClient.UpdateAsync<PhotoDocument, object>(id, p => p.Doc(partialObject));
        }
        public async Task UpdatePartiallyAsync<TPartialObject>(int id, TPartialObject partialObject)
            where TPartialObject : class
        {
            await _elasticClient.UpdateAsync<PhotoDocument, TPartialObject>(id, p => p.Doc(partialObject));
        }

        #region GET
        public async Task<PhotoDocument> Get(int elasticId)
        {
            return (await _elasticClient.GetAsync<PhotoDocument>(elasticId)).Source;
        }
        public async Task<IEnumerable<PhotoDocument>> Get()
        {
            var mustClauses = new List<QueryContainer>
            {
                new TermQuery {Field = Infer.Field<PhotoDocument>(p => p.IsDeleted), Value = false},
                new MatchQuery {Field = Infer.Field<PhotoDocument>(p => p.BlobId), Query = ".*images.*"}
            };

            var searchRequest = new SearchRequest<PhotoDocument>(_indexName)
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
            return (await _elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;
        }

        public async Task<IEnumerable<PhotoDocument>> Find(int id, string criteria)
        {
            var requestResult = await _elasticClient.SearchAsync<PhotoDocument>(p => p
             .Query(q => q
                 .Bool(d => d
                     .Must(m => m
                         .Match(k => k
                             .Field(f => f.BlobId)
                             .Query(".*images.*")
                         ), m => m
                         .Match(k => k
                             .Field(f => f.IsDeleted)
                             .Query("false")
                         ), m => m
                         .Match(k => k
                            .Field(f => f.UserId)
                            .Query($"{id}")
                         ), m => m
                         .Bool(b => b
                            .MinimumShouldMatch(1)
                             .Should(s => s
                                 .MatchPhrasePrefix(w => w
                                     .Field(f => f.Description)
                                     .Query($"{criteria}")
                                  ), s => s
                                 .MatchPhrasePrefix(w => w
                                     .Field(f => f.Name)
                                     .Query($"{criteria}")
                                 ), s => s
                                 .MatchPhrasePrefix(w => w
                                    .Field(f => f.Location)
                                    .Query($"{criteria}")
                                 ), s => s
                                 .MatchPhrasePrefix(w => w
                                     .Field(f => f.Tags)
                                     .Query($"{criteria}")
                              )
                          )
                     )
                )
            )));
            return requestResult.Documents;
        }

        public async Task<Dictionary<string, List<string>>>FindFields(int id, string criteria)
        {
            var requestResult = await _elasticClient.SearchAsync<PhotoDocument>(p => p
            .Source(sr => sr
                .Includes(i => i
                    .Field(f => f.Name)
                    .Field(f => f.Blob64Id)
                    .Field(f => f.Location)
                    .Field(f => f.Description)
                    .Field(f => f.Tags)
                 )
              )
             .Query(q => q
                 .Bool(d => d
                     .Must(m => m
                         .Match(k => k
                             .Field(f => f.BlobId)
                             .Query(".*images.*")
                         ), m => m
                         .Match(k => k
                             .Field(f => f.IsDeleted)
                             .Query("false")
                         ), m => m
                         .Match(k => k
                            .Field(f => f.UserId)
                            .Query($"{id}")
                         ), m => m
                         .Bool(b => b
                            .MinimumShouldMatch(1)
                             .Should(s => s
                                 .MatchPhrasePrefix(w => w
                                     .Field(f => f.Description)
                                     .Query($"{criteria}")
                                  ), s => s
                                 .MatchPhrasePrefix(w => w
                                     .Field(f => f.Name)
                                     .Query($"{criteria}")
                                 ), s => s
                                 .MatchPhrasePrefix(w => w
                                    .Field(f => f.Location)
                                    .Query($"{criteria}")
                                 ), s => s
                                 .MatchPhrasePrefix(w => w
                                     .Field(f => f.Tags)
                                     .Query($"{criteria}")
                                  )
                              )
                          )
                     )
                )
            )
        );
            //TODO - rewrite this awful code
            var names = requestResult.Documents
                .Where(p => p.Name.ToLower()
                    .Contains(criteria.ToLower()))
                    .Select(m => m.Name)
                    .Distinct()
                    .ToList();
            var thumbnails = requestResult.Documents
                .Where(p => p.Name.ToLower()
                    .Contains(criteria.ToLower()))
                    .Select(x => Path.GetFileName(x.Blob64Id))
                    .Distinct()
                    .ToList();
            var description = requestResult.Documents
                .Where(p => p.Description != null &&  p.Description.ToLower()
                    .Contains(criteria.ToLower()))
                    .Select(m => m.Description)
                    .Distinct()
                    .ToList();
            var locations = requestResult.Documents
                .Where(p => p.Location != null && p.Location.ToLower()
                    .Contains(criteria.ToLower()))
                    .Select(m => m.Location)
                    .Distinct()
                    .ToList();
            var tags = requestResult.Documents
                .Where(p => p.Tags != null && p.Tags.ToLower()
                        .Contains(criteria.ToLower()))
                        .Select(m => m.Tags)
                        .Distinct()
                        .ToList();

            var dict = new Dictionary<string, List<string>>()
            {
                {"names", names },
                {"thumbnails", thumbnails },
                {"description", description },
                {"locations", locations },
                {"tags", tags}
            };
            return dict;
        }

        public async Task<IEnumerable<PhotoDocument>> GetDeletedPhoto(int userId)
        {
            var mustClauses = new List<QueryContainer>
            {
                new TermQuery {Field = Infer.Field<PhotoDocument>(p => p.IsDeleted), Value = true},
                new TermQuery {Field = Infer.Field<PhotoDocument>(t => t.UserId), Value = userId,}
            };

            var searchRequest = new SearchRequest<PhotoDocument>(_indexName)
            {
                Size = 100,
                From = 0,
                Query = new BoolQuery { Must = mustClauses }
            };

            return (await _elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;
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

        public async Task<IEnumerable<PhotoDocument>> GetUserPhotosRange(int userId, int startIndex, int count)
        {
            var mustClauses = new List<QueryContainer>
            {
                new TermQuery {Field = Infer.Field<PhotoDocument>(p => p.IsDeleted), Value = false},
                new TermQuery {Field = Infer.Field<PhotoDocument>(t => t.UserId), Value = userId,},
                new MatchQuery {Field = Infer.Field<PhotoDocument>(p => p.BlobId), Query = ".*images.*"}
            };

            var searchRequest = new SearchRequest<PhotoDocument>(_indexName)
            {
                Size = count,
                From = startIndex,
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
            return (await _elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;
        }
        #endregion
    }
}
