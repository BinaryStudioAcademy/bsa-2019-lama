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
    public class SharingPhotoService: BaseService<Photo>
    {
        private string _photoApiUrl;

        public SharingPhotoService(string photoApiUrl,ApplicationDbContext context)
            :base(context)
        {
            _photoApiUrl = photoApiUrl;
        }
        

        public async Task<Photo> Get(int id)
        {
            var sharedPhotoData = await Context.Photos
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


    }
}