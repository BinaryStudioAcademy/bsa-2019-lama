using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http.Formatting;

namespace Lama.BusinessLogic.Services
{
    public class PhotoService
    {
        public async Task<HttpResponseMessage> SendPhotoToApi(string[] photos)
        {
            HttpResponseMessage response;
            using (HttpClient client = new HttpClient())
            {
                var url = "https://localhost:44367/";
                client.BaseAddress = new Uri(url);
                var new_url = url + "api/photos";
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                response = await client.PostAsJsonAsync($"{new_url}", photos);
            }
            
            return response;
        }

        
    }
}
