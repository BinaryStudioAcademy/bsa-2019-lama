﻿using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Photo.DataAccess.Interfaces;
using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;

namespace Photo.BusinessLogic.Services
{
    public class DuplicatesService
    {
        private readonly IElasticStorage _elasticStorage;
        private readonly IMapper _mapper;
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public DuplicatesService(IElasticStorage elasticStorage, IMapper mapper, IConfiguration configuration)
        {
            _elasticStorage = elasticStorage;
            _mapper = mapper;
            _httpClient = new HttpClient();
			_configuration = configuration;
		}
        public async Task SendDuplicates(List<int> duplicates)
        {
            var photos = new List<PhotoDocument>();
            foreach (var value in duplicates)
            {
                try
                {
                    var photo = await _elasticStorage.Get(value);
                    photos.Add(photo);
                }
                catch (Exception e)
                {

                }
            }
            string uri = _configuration["LamaApiUrl"];
            var dto = _mapper.Map<IEnumerable<PhotoDocumentDTO>>(photos);

            StringContent content = new StringContent(JsonConvert.SerializeObject(dto), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await _httpClient.PostAsync(uri, content);
        }
    }
}
