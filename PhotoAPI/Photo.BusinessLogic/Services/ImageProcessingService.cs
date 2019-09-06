using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Photo.DataAccess.Interfaces;
using Photo.Domain.DataTransferObjects;

namespace Photo.BusinessLogic.Services
{
    public class ImageProcessingService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;

        public ImageProcessingService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _configuration = configuration;
        }
        public async Task SendCategory(string toString)
        {
            var uri = _configuration["LamaApiUrl"];

            var content = new StringContent(JsonConvert.SerializeObject(toString), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(uri, content);
        }
    }
}