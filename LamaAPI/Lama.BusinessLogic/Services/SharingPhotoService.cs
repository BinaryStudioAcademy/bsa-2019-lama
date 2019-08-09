using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Lama.BusinessLogic.Exceptions;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Lama.BusinessLogic.Services
{
    public class SharingPhotoService: IBaseService<Photo>
    {
        private ApplicationDbContext _context;
        private string _photoApiUrl;

        public SharingPhotoService(IConfiguration configuration,ApplicationDbContext context)
        {
            _context = context;
            _photoApiUrl = configuration.GetSection("PhotoApiUrl").Value;
            
        }
        
        public Task<IEnumerable<Photo>> FindAll()
        {
            throw new System.NotImplementedException();
        }

        public async Task<Photo> Get(int id)
        {
            var sharedPhotoData = await _context.Photos
                .Include(photo => photo.PhotoState)
                .Include(photo => photo.Likes)
                .ThenInclude(like => like.User)
                .Include(photo => photo.Comments)
                .ThenInclude(comment => comment.User)
                .Include(photo => photo.User)
                .FirstOrDefaultAsync(photoId => photoId.Id == id);

            if (sharedPhotoData == null)
            {
                throw new NotFoundException(nameof(Photo), id);
            }

            return sharedPhotoData;
        }

        public async Task<HttpResponseMessage> UpdatePhotoDocumentWithSharedLink(int id, string sharedLink)
        {
            HttpResponseMessage response;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(_photoApiUrl);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                response = await client.PostAsJsonAsync($"{_photoApiUrl}/api/photos/shared/{id}", sharedLink);
            }

            return response;
        }

        public Task Create(Photo item)
        {
            throw new System.NotImplementedException();
        }

        public Task Update(Photo item)
        {
            throw new System.NotImplementedException();
        }

        public Task Delete(int id)
        {
            throw new System.NotImplementedException();
        }
    }
}