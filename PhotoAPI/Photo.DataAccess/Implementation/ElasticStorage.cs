﻿using Nest;

using Photo.DataAccess.Interfaces;
using Photo.Domain.BlobModels;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

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
        public async Task<int> CheckUserPhoto(Tuple<int, int> tuple)
        {
            var mustClauses = new List<QueryContainer>();

            mustClauses.Add(new TermQuery
            {
                Field = Infer.Field<PhotoDocument>(t => t.Id),
                Value = tuple.Item2,
            });

            mustClauses.Add(new TermQuery
            {
                Field = Infer.Field<PhotoDocument>(t => t.UserId),
                Value = tuple.Item1,
            });

            var searchRequest = new SearchRequest<PhotoDocument>(indexName)
            {
                Size = 100,
                From = 0,
                Query = new BoolQuery { Must = mustClauses }
            };

            var s = (await elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;
            if(s.Count == 0)
            {
                var doc = await Get(tuple.Item2);
                return doc.UserId;
            }
            return tuple.Item1;
        }
        // METHODS
        public async Task<CreateResponse> CreateAsync(PhotoDocument item)
        {
            return await elasticClient.CreateDocumentAsync(item);
        }

        public async Task<CreateResponse> CreateAsync(int id, PhotoDocument item)
        {
            item.Id = id;
            return await elasticClient.CreateDocumentAsync(item);
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

        public async Task<IEnumerable<PhotoDocument>> Find(int id, string criteria)
        {
            var requestResult = await elasticClient.SearchAsync<PhotoDocument>(p => p
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
                                 )
                              )
                          )
                     )
                )
            ));
            return requestResult.Documents;
        }

        public async Task<Dictionary<string, List<string>>>FindFields(int id, string criteria)
        {
            var requestResult = await elasticClient.SearchAsync<PhotoDocument>(p => p
            .Source(sr => sr
                .Includes(i => i
                    .Field(f => f.Name)
                    .Field(f => f.Location)
                    .Field(f => f.Description)
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
                                 )
                              )
                          )
                     )
                )
            )
        );
            //TODO - rewrite this awful code
            List<string> names = requestResult.Documents
                .Where(p => p.Name.ToLower()
                    .Contains(criteria.ToLower()))
                    .Select(m => m.Name)
                    .Distinct()
                    .ToList();
            List<string> description = requestResult.Documents
                .Where(p => p.Description != null &&  p.Description.ToLower()
                    .Contains(criteria.ToLower()))
                    .Select(m => m.Description)
                    .Distinct()
                    .ToList();
            List<string> locations = requestResult.Documents
                .Where(p => p.Location != null && p.Location.ToLower()
                    .Contains(criteria.ToLower()))
                    .Select(m => m.Location)
                    .Distinct()
                    .ToList();

            var dict = new Dictionary<string, List<string>>()
            {
                {"names", names },
                {"desription", description },
                {"locations", locations }
            };
            return dict;
        }

        public async Task<IEnumerable<PhotoDocument>> GetDeletedPhoto(int userId)
        {
            var mustClauses = new List<QueryContainer>();

            mustClauses.Add(new TermQuery
            {
                Field = Infer.Field<PhotoDocument>(p => p.IsDeleted),
                Value = true
            });

            mustClauses.Add(new TermQuery
            {
                Field = Infer.Field<PhotoDocument>(t => t.UserId),
                Value = userId,
            });

            var searchRequest = new SearchRequest<PhotoDocument>(indexName)
            {
                Size = 100,
                From = 0,
                Query = new BoolQuery { Must = mustClauses }
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

        public async Task<IEnumerable<PhotoDocument>> GetUserPhotosRange(int userId, int startIndex, int count)
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
            return (await elasticClient.SearchAsync<PhotoDocument>(searchRequest)).Documents;
        }
        #endregion
    }
}
