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
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                response = await client.PostAsJsonAsync($"{url}api/photos", photos);
            }
            
            return response;
        }

        
    }
}
