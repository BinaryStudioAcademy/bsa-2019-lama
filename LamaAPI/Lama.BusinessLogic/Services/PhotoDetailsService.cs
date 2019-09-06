using AutoMapper;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Lama.DataAccess.Interfaces;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.PhotoDetails;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Services
{
    public class PhotoDetailsService : IPhotoDetailsService
    {
        private string url;
        private IUnitOfWork _context;
        private HttpClient httpClient;
        private readonly IMapper _mapper;
        ApplicationDbContext Context;
        ILocationService locationService;
        public PhotoDetailsService(string url, IUnitOfWork context, IMapper _mapper, ApplicationDbContext Context, ILocationService locationService)
        {
            this.url = url;
            _context = context;
            httpClient = new HttpClient();
            this._mapper = _mapper;
            this.Context = Context;
            this.locationService = locationService;
        }
        public async Task<string> UpdateDescription(NewDescription newDescription)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/{newDescription.Id}");
            var responseContent = await response.Content.ReadAsStringAsync();
            var doc = JsonConvert.DeserializeObject<PhotoDocument>(responseContent);

            string uri = $"{url}api/photos/document";
            doc.Description = newDescription.Description;
            StringContent content = new StringContent(JsonConvert.SerializeObject(doc), Encoding.UTF8, "application/json");
            await httpClient.PutAsync(uri, content);

            return JsonConvert.SerializeObject(doc.Description);
        }

        public async Task<string> UpdateLocation(NewLocation newLocation)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/{newLocation.Id}");
            var responseContent = await response.Content.ReadAsStringAsync();
            var doc = JsonConvert.DeserializeObject<PhotoDocument>(responseContent);

            string uri = $"{url}api/photos/document";
            doc.Location = newLocation.Location;
            doc.Coordinates = newLocation.Coordinates;
            StringContent content = new StringContent(JsonConvert.SerializeObject(doc), Encoding.UTF8, "application/json");
            await httpClient.PutAsync(uri, content);

            var dbPhoto = await Context.Photos.FirstOrDefaultAsync(x => x.Id == newLocation.Id);
            var oldLocation = dbPhoto.LocationId;
            dbPhoto.LocationId = await locationService.CheckAdrress(newLocation.ShortLocation);
            Context.Photos.Update(dbPhoto);
            await Context.SaveChangesAsync();

            var haveLocation = await Context.Photos.FirstOrDefaultAsync(x => x.LocationId == oldLocation);
            if (haveLocation == null)
            {
                if (oldLocation.HasValue)
                {
                    await locationService.DeleteLocation(oldLocation.Value);
                }
            }

            return JsonConvert.SerializeObject(doc.Location);
        }

        public async Task DeleteLocation(int id)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/{id}");
            var responseContent = await response.Content.ReadAsStringAsync();
            var doc = JsonConvert.DeserializeObject<PhotoDocument>(responseContent);

            string uri = $"{url}api/photos/document";
            doc.Location = String.Empty;
            doc.Coordinates = string.Empty;
            StringContent content = new StringContent(JsonConvert.SerializeObject(doc), Encoding.UTF8, "application/json");
            await httpClient.PutAsync(uri, content);
        }

        public async Task<DateTime> UpdatePhotoDate(NewDatePhoto time)
        {
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos/{time.Id}");
            var responseContent = await response.Content.ReadAsStringAsync();
            var doc = JsonConvert.DeserializeObject<PhotoDocument>(responseContent);

            string uri = $"{url}api/photos/document";
            doc.UploadDate = time.Date;
            StringContent content = new StringContent(JsonConvert.SerializeObject(doc), Encoding.UTF8, "application/json");
            await httpClient.PutAsync(uri, content);

            return doc.UploadDate;
        }
    }
}
