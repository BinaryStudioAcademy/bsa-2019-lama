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
    public class PhotoService: IPhotoService, IDisposable
    {
        // FIELDS
        private string url;
        private HttpClient httpClient;

        // CONSTRUCTORS
        public PhotoService(string url)
        {
            this.url = url;
            this.httpClient = new HttpClient();
        }

        public void Dispose()
        {
            this.httpClient.Dispose();
        }

        // METHODS
        public Task<HttpResponseMessage> CreateAll(PhotoReceived[] photos)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            return httpClient.PostAsJsonAsync($"{url}api/photos", photos);
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
