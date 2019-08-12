using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Lama.BusinessLogic.Exceptions;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

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

        public async Task<PhotoDocument> UpdatePhotoDocumentWithSharedLink(int id, string sharedLink)
        {
            PhotoDocument photoDocumentWithSharedLink;
            using (HttpClient client = new HttpClient())
            {
                client.BaseAddress = new Uri(_photoApiUrl);
                
                StringContent content = new StringContent(sharedLink);
                
                var httpResponse = await (client.PutAsync($"{_photoApiUrl}api/photos/shared/{id}", content));
                
                var jsonResponse = await httpResponse.Content.ReadAsStringAsync();
                
                photoDocumentWithSharedLink = JsonConvert.DeserializeObject<PhotoDocument>(jsonResponse);
            }

            return photoDocumentWithSharedLink;
        }
		
        public Task Delete(int id)
        {
            throw new System.NotImplementedException();
        }

        public async Task SharingPhoto(SharedPhoto sharedPhoto)
        {
            await _context.SharedPhotos.AddAsync(sharedPhoto);
            await _context.SaveChangesAsync();
        }
    }
}