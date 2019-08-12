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
    public class PhotoService : IPhotoService, IDisposable
    {
        // FIELDS
        private string url;
        private IUnitOfWork _context;
        private HttpClient httpClient;
        public PhotoService(string url, IUnitOfWork context)
        {
            this.url = url;
            _context = context;
            httpClient = new HttpClient();
        }
        public async Task CreateAll(PhotoReceived[] photos)
        {
            var response = await httpClient.PostAsJsonAsync($"{url}api/photos", photos);
            var responseContent = await response.Content.ReadAsStringAsync();
            var elasticIds = JsonConvert.DeserializeObject<IEnumerable<int>>(responseContent);

            for (int i = 0; i < photos.Length; i++)
            {
                await _context.GetRepository<Photo>().InsertAsync(new Photo { ElasticId = elasticIds.ElementAt(i) });
            }
            await _context.SaveAsync();

        }

        public void Dispose()
        {
            this.httpClient.Dispose();
        }


        public async Task<IEnumerable<PhotoDocument>> GetAll()
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos");

            var responseContent = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
        }

        public async Task<IEnumerable<PhotoDocument>> GetUserPhotos(int id)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/user/{id}");

            var responseContent = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
        }
        public async Task<UpdatedPhotoResultDTO> UpdatePhoto(UpdatePhotoDTO updatePhotoDTO)
        {

            string uri = $"{url}api/photos";

            StringContent content = new StringContent(JsonConvert.SerializeObject(updatePhotoDTO), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await httpClient.PutAsync(uri, content);

            string bodyJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<UpdatedPhotoResultDTO>(bodyJson);

        }

        public Task<int> Create(PhotoDocument item)
        {
            throw new NotImplementedException();
        }

        public async Task<Photo> Create(PhotoReceived item)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await httpClient.PostAsJsonAsync($"{url}api/photos", item);
            var responseContent = await response.Content.ReadAsStringAsync();
            var elasticId = Convert.ToInt32(responseContent);

            await _context.GetRepository<Photo>().InsertAsync(new Photo { ElasticId = elasticId });
            await _context.SaveAsync();
            return (await _context.GetRepository<Photo>().GetAsync(i => i.ElasticId == elasticId)).LastOrDefault();
        }

        public async Task<Photo> CreateAvatar(PhotoReceived item)
        {

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.PostAsJsonAsync($"{url}api/photos/avatar", item);
            var responseContent = await response.Content.ReadAsStringAsync();
            var elasticId = Convert.ToInt32(responseContent);

            await _context.GetRepository<Photo>().InsertAsync(new Photo { ElasticId = elasticId });
            await _context.SaveAsync();
            return (await _context.GetRepository<Photo>().GetAsync()).LastOrDefault();

        }

        public async Task<PhotoDocument> Get(int id)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/{--id}");

            var responseContent = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<PhotoDocument>(responseContent);
        }

        #region DELETE
        public Task MarkPhotoAsDeleted(int photoToDeleteId)
        {
            string uri = $"{url}api/photos/{photoToDeleteId}";

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
