using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Lama.Domain.BlobModels;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DataTransferObjects.Photo;


namespace Lama.BusinessLogic.Services
{
    public class PhotoService: IBaseService<PhotoDocument>
    {
        private string url;
        public PhotoService(string url)
        {
            this.url = url;
        }
        public async Task<HttpResponseMessage> CreateAll(PhotoReceived[] photos)
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

        public async Task<IEnumerable<PhotoDocument>> GetAll()
        {
            IEnumerable<PhotoDocument> photos;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                photos = JsonConvert.DeserializeObject <IEnumerable<PhotoDocument>>
                    (await 
                    (await client.GetAsync($"{url}api/photos"))
                        .Content.ReadAsStringAsync());
            }
            return photos;
        }
        
        public async Task<UpdatedPhotoResultDTO> UpdatePhoto(UpdatePhotoDTO updatePhotoDTO)
        {
            using (HttpClient httpClient = new HttpClient())
            {
                string uri = $"{url}api/photos";

                StringContent content = new StringContent(JsonConvert.SerializeObject(updatePhotoDTO), Encoding.UTF8, "application/json");

                HttpResponseMessage response = await httpClient.PutAsync(uri, content);

                string bodyJson = await response.Content.ReadAsStringAsync();

                return JsonConvert.DeserializeObject<UpdatedPhotoResultDTO>(bodyJson);
            }
        }
        
        public Task<int> Create(PhotoDocument item)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<PhotoDocument>> FindAll()
        {
            throw new NotImplementedException();
        }

        public Task<PhotoDocument> Get(int id)
        {
            throw new NotImplementedException();
        }
        public Task<PhotoDocument> Update(PhotoDocument item, object key)
        {
            throw new NotImplementedException();
        }

        public Task<int> Delete(PhotoDocument id)
        {
            throw new NotImplementedException();
        }
    }
}
