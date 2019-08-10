using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Lama.Domain.BlobModels;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess.Interfaces;
using Lama.Domain.DbModels;
using System.Linq;
using Lama.Domain.DataTransferObjects.Photo;


namespace Lama.BusinessLogic.Services
{
    public class PhotoService: IPhotoService, IDisposable
    {
        // FIELDS
        private string url;
        private IUnitOfWork _context;
        public PhotoService(string url, IUnitOfWork context)
        {
            this.url = url;
            _context = context;
        }
        public async Task CreateAll(PhotoReceived[] photos)
        {

            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var elasticIds = JsonConvert.DeserializeObject<IEnumerable<int>>(await (await client.PostAsJsonAsync($"{url}api/photos", photos)).Content.ReadAsStringAsync());
                for (int i =0; i<photos.Length; i++)
                {
                    await _context.GetRepository<Photo>().InsertAsync(new Photo { ElasticId = elasticIds.ElementAt(i) });
                }
                await _context.SaveAsync();
            }
        }

        public async Task<IEnumerable<PhotoDocument>> GetAll()
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            return JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>
                    (await
                    (await httpClient.GetAsync($"{url}api/photos"))
                        .Content.ReadAsStringAsync());
        }

        public async Task<UpdatedPhotoResultDTO> UpdatePhoto(UpdatePhotoDTO updatePhotoDTO)
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

        public async Task<Photo> Create(PhotoReceived item)
        {
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //var elasticId = await (await client.PostAsJsonAsync($"{url}api/photos", item)).Content.ReadAsStringAsync();
                var elasticId = 
                    await 
                    (await client.PostAsJsonAsync($"{url}api/photos", item)).Content.ReadAsStringAsync();
                var photo = Convert.ToInt32(elasticId);
                await _context.GetRepository<Photo>().InsertAsync(new Photo { ElasticId = photo });
                await _context.SaveAsync();
                return (await _context.GetRepository<Photo>().GetAsync(i => i.ElasticId == photo)).LastOrDefault();
            }
        
        }

        public async Task<Photo> CreateAvatar(PhotoReceived item)
        {
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                //var elasticId = await (await client.PostAsJsonAsync($"{url}api/photos", item)).Content.ReadAsStringAsync();
                var elasticId =
                    await
                    (await client.PostAsJsonAsync($"{url}api/photos/avatar", item)).Content.ReadAsStringAsync();
                var photo = Convert.ToInt32(elasticId);
                await _context.GetRepository<Photo>().InsertAsync(new Photo { ElasticId = photo });
                await _context.SaveAsync();
                return (await _context.GetRepository<Photo>().GetAsync()).LastOrDefault();
            }
        }

        public Task<IEnumerable<PhotoDocument>> FindAll()
            return JsonConvert.DeserializeObject<UpdatedPhotoResultDTO>(bodyJson);
        }

        #region DELETE
        public Task MarkPhotoAsDeleted(int photoToDeleteId)
        {
            string uri = $"{url}api/photos/{photoToDeleteId}";            

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
            return httpClient.DeleteAsync(uri);
        }
        public async Task<DeletedPhotoDTO[]> GetDeletedPhotos()
        {
            string uri = $"{url}api/photos/deleted";

            HttpResponseMessage response = await httpClient.GetAsync(uri);

            string bodyJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<DeletedPhotoDTO[]>(bodyJson);
        }

        public Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            string uri = $"{url}api/photos/delete_permanently";

            StringContent content = new StringContent(JsonConvert.SerializeObject(photosToDelete), Encoding.UTF8, "application/json");

            return httpClient.PostAsync(uri, content);
        }

        public Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            string uri = $"{url}api/photos/restore";

            StringContent content = new StringContent(JsonConvert.SerializeObject(photosToRestore), Encoding.UTF8, "application/json");

            return httpClient.PostAsync(uri, content);
        }
        #endregion

    }
}
