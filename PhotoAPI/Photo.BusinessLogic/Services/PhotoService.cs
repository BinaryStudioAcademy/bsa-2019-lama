using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Photo.DataAccess;
using Photo.DataAccess.Blob;
using Photo.Domain.BlobModels;
using Photo.BusinessLogic.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;

namespace Photo.BusinessLogic.Services
{
    public class PhotoService: IBaseService<PhotoDocument>
    {
        AppDbContext _db;
        private PhotoBlobStore _store;
        public PhotoService(AppDbContext context, IConfiguration configuration)
        {
            _db = context;
            _store = new PhotoBlobStore(configuration.GetSection("Storage").Value);
        }

      
        public async Task<IEnumerable<PhotoDocument>> GetAll()
        {
            return await _db.Photos.ToListAsync();
        }

        public Task <PhotoDocument> Get(int blobId)
        {
            throw new NotImplementedException();
        }

        public Task Delete(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<PhotoDocument>> FindAll()
        {
            throw new NotImplementedException();
        }


        public Task Update(PhotoDocument item)
        {
            throw new NotImplementedException();
        }

        public Task Create(PhotoDocument item)
        {
            throw new NotImplementedException();
        }

        public async Task CreateAll(PhotoReceived[] photos)
        {
            string[] base64 = new string[photos.Length];
            
            for (int i = 0; i < photos.Length; i++)
            {
                base64[i] = photos[i].ImageUrl.Replace("data:image/jpeg;base64,", String.Empty).Replace("data:image/png;base64,", String.Empty).Replace("-", "+").Replace("_", "/");
                var id = await _store.LoadPhotoToBlob(base64[i]);
                await SaveToElastic(new PhotoReceived
                {
                    ImageUrl = id,
                    Description = photos[i].Description
                });
            }
        }

        public async Task SaveToElastic(PhotoReceived photo)
        {
            // save to fake db now
            var obj = new PhotoDocument
            {
                BlobId = photo.ImageUrl,
                Blob16Id = "",
                Blob32Id = "",
                CategoryId = 0,
                Description = photo.Description,
                IsDeleted = false,
                Location = "",
                OriginalBlobId = "",
                SharedLink = "",
                UploadDate = DateTime.Now,
                UserId = 0
            };
            await _db.Photos.AddAsync(obj);
            await _db.SaveChangesAsync();
        }
    }
}
