using AutoMapper;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess.Interfaces;
using Lama.Domain.BlobModels;
using Lama.Domain.DTO.PhotoDetails;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Services
{
    public class PhotoDetailsService : IPhotoDetailsService
    {
        private string url;
        private IUnitOfWork _context;
        private HttpClient httpClient;
        private readonly IMapper _mapper;

        public PhotoDetailsService(string url, IUnitOfWork context, IMapper _mapper)
        {
            this.url = url;
            _context = context;
            httpClient = new HttpClient();
            this._mapper = _mapper;
        }
        public async Task<string> UpdateDescription(NewDescription newDescription)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/{newDescription.Id}");
            var responseContent = await response.Content.ReadAsStringAsync();
            var doc = JsonConvert.DeserializeObject<PhotoDocument>(responseContent);

            string uri = $"{url}api/photos/document";
            doc.Description = newDescription.Description;
            StringContent content = new StringContent(JsonConvert.SerializeObject(doc), Encoding.UTF8, "application/json");
            await httpClient.PutAsync(uri, content);

            return JsonConvert.SerializeObject(doc.Description);
        }

        public async Task<string> UpdateLocation(NewLocation newLocation)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/{newLocation.Id}");
            var responseContent = await response.Content.ReadAsStringAsync();
            var doc = JsonConvert.DeserializeObject<PhotoDocument>(responseContent);

            string uri = $"{url}api/photos/document";
            doc.Location = newLocation.Location;
            StringContent content = new StringContent(JsonConvert.SerializeObject(doc), Encoding.UTF8, "application/json");
            await httpClient.PutAsync(uri, content);

            return JsonConvert.SerializeObject(doc.Location);
        }

        public async Task DeleteLocation(int id)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/{id}");
            var responseContent = await response.Content.ReadAsStringAsync();
            var doc = JsonConvert.DeserializeObject<PhotoDocument>(responseContent);

            string uri = $"{url}api/photos/document";
            doc.Location = String.Empty;
            StringContent content = new StringContent(JsonConvert.SerializeObject(doc), Encoding.UTF8, "application/json");
            await httpClient.PutAsync(uri, content);
        }

        public async Task<DateTime> UpdatePhotoDate(NewDatePhoto time)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/{time.Id}");
            var responseContent = await response.Content.ReadAsStringAsync();
            var doc = JsonConvert.DeserializeObject<PhotoDocument>(responseContent);

            string uri = $"{url}api/photos/document";
            doc.UploadDate = time.Date;
            StringContent content = new StringContent(JsonConvert.SerializeObject(doc), Encoding.UTF8, "application/json");
            await httpClient.PutAsync(uri, content);

            return doc.UploadDate;
        }
    }
}
