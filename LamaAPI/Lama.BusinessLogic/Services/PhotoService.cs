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
                    await _context.SaveAsync();
                }
               
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
