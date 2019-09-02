using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
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

        public DuplicatesService(IElasticStorage elasticStorage, IMapper mapper)
        {
            _elasticStorage = elasticStorage;
            _mapper = mapper;
            _httpClient = new HttpClient();
        }
        public async Task SendDuplicates(List<int> duplicates)
        {
            var photos = new List<PhotoDocument>();
            foreach (var value in duplicates)
            {
                var photo = await _elasticStorage.Get(value);
                photos.Add(photo);
            }
            string uri = $"http://localhost:5000/api/photo/duplicates_response";
            var dto = _mapper.Map<IEnumerable<PhotoDocumentDTO>>(photos);

            StringContent content = new StringContent(JsonConvert.SerializeObject(dto), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await _httpClient.PostAsync(uri, content);

            string bodyJson = await response.Content.ReadAsStringAsync();
        }
    }
}
