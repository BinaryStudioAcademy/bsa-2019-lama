using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Newtonsoft.Json;
using Photo.DataAccess.Interfaces;
using Photo.Domain.DataTransferObjects;

namespace Photo.BusinessLogic.Services
{
    public class ImageProcessingService
    {
        private readonly HttpClient _httpClient;

        public ImageProcessingService()
        {
            _httpClient = new HttpClient();
        }
        public async Task SendCategory(string toString)
        {
            const string uri = "http://localhost:5000/api/photo/photoCategory";

            var content = new StringContent(JsonConvert.SerializeObject(toString), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync(uri, content);
        }
    }
}