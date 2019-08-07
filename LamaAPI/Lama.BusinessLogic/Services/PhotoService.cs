using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http.Formatting;
using Newtonsoft.Json;
using Lama.Domain.BlobModels;
using Lama.BusinessLogic.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Lama.BusinessLogic.Services
{
    public class PhotoService: IPhotoService
    {
        private string url;
        public PhotoService(IConfiguration configuration)
        {
            url = configuration.GetSection("PhotoApiUrl").Value;
        }
        public async Task<HttpResponseMessage> SendPhotoToApi(PhotoReceived[] photos)
        {
            HttpResponseMessage response;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                response = await client.PostAsJsonAsync($"{url}api/photos", photos);
            }
            
            return response;
        }

        public IEnumerable<PhotoDocument> LoadPhotosFromApi()
        {
            IEnumerable<PhotoDocument> photos;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                photos = JsonConvert.DeserializeObject <IEnumerable<PhotoDocument>>( client.GetAsync($"{url}api/photos").Result.Content.ReadAsStringAsync().Result);
            }
            return photos;

        }

        
    }
}
