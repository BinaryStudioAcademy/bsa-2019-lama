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
using Lama.DataAccess.Interfaces;
using Lama.Domain.DbModels;
using System.Linq;

namespace Lama.BusinessLogic.Services
{
    public class PhotoService: IBaseService<PhotoDocument>
    {
        private string url;
        private IUnitOfWork _context;
        public PhotoService(string url, IUnitOfWork context)
        {
            this.url = url;
            _context = context;
        }
        public async Task<HttpResponseMessage> CreateAll(PhotoReceived[] photos)
        {
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                foreach (var item in photos)
                {
                    var elasticId = await (await client.PostAsJsonAsync($"{url}api/photos", item)).Content.ReadAsStringAsync();
                    var photo = Convert.ToInt32(elasticId);
                    await _context.GetRepository<Photo>().InsertAsync(new Photo { ElasticId = photo });
                    
                }
                await _context.SaveAsync();

            }
            return new HttpResponseMessage();
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

        public async Task<int> Create(PhotoDocument item)
        {
            return 1;
        }

        public async Task<Photo> Create(PhotoReceived item)
        {
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //var elasticId = await (await client.PostAsJsonAsync($"{url}api/photos", item)).Content.ReadAsStringAsync();
                var elasticId = client.PostAsJsonAsync($"{url}api/photos", item).Result.Content.ReadAsStringAsync().Result;
                var photo = Convert.ToInt32(elasticId);
                
                await _context.GetRepository<Photo>().InsertAsync(new Photo { ElasticId = photo });
                await _context.SaveAsync();
                return (await _context.GetRepository<Photo>().GetAsync(p => p.ElasticId != photo)).LastOrDefault();
            }
        }

        public async Task<Photo> CreateAvatar(PhotoReceived item)
        {
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //var elasticId = await (await client.PostAsJsonAsync($"{url}api/photos", item)).Content.ReadAsStringAsync();
                var elasticId = client.PostAsJsonAsync($"{url}api/photos/avatar", item).Result.Content.ReadAsStringAsync().Result;
                var photo = Convert.ToInt32(elasticId);

                await _context.GetRepository<Photo>().InsertAsync(new Photo { ElasticId = photo });
                await _context.SaveAsync();
                return (await _context.GetRepository<Photo>().GetAsync()).LastOrDefault();
            }
        }

        public Task<IEnumerable<PhotoDocument>> FindAll()
        {
            throw new NotImplementedException();
        }

        public async Task<PhotoDocument> Get(int id)
        {
            id--;
            PhotoDocument photo;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                photo = JsonConvert.DeserializeObject<PhotoDocument>
                    (await
                    (await client.GetAsync($"{url}api/photos/{id}"))
                        .Content.ReadAsStringAsync());
            }
            return photo;
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
