using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Net.Http.Formatting;
using Newtonsoft.Json;
using System.Linq;
using Lama.Domain.BlobModels;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess.Interfaces;
using Lama.Domain.DbModels;

namespace Lama.BusinessLogic.Services
{
    public class PhotoService: IBaseService<PhotoDocument>
    {
        private string url;
        IUnitOfWork _context;
        public PhotoService(IUnitOfWork context, string url)
        {
            _context = context;
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

        public Task Create(PhotoDocument item)
        {
            throw new NotImplementedException();
        }

        public Task Delete(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<PhotoDocument>> FindAll()
        {
            throw new NotImplementedException();
        }

        public async Task<PhotoDocument> Get(int id)
        {
            PhotoDocument photo;
            int elasticId = (await _context.GetRepository<Photo>().GetAsync(p => p.Id == id)).FirstOrDefault().ElasticId;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                photo = JsonConvert.DeserializeObject<PhotoDocument>
                    (await
                    (await client.GetAsync($"{url}api/photos/{elasticId}"))
                        .Content.ReadAsStringAsync());
            }
            return photo;
        }

        public Task Update(PhotoDocument item)
        {
            throw new NotImplementedException();
        }


    }
}
