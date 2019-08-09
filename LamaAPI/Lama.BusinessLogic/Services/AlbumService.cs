using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Album;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Services
{
    public class AlbumService : BaseService<Album>, IAlbumService
    {
        IConfiguration configuration;
        public AlbumService(ApplicationDbContext Context,IConfiguration configuration) 
            : base(Context)
        {
            this.Context = Context;
            this.configuration = configuration;
        }

        public async Task CreateAlbumWithNewPhotos(NewAlbum album)
        {
            string url = configuration["PhotoApiUrl"];
            HttpResponseMessage response;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                response = await client.PostAsJsonAsync($"{url}api/photos", album.Photos);
            }
        }
        public async Task CreateAlbumWithExistPhotos(NewAlbum album)
        {

        }
    }
}
