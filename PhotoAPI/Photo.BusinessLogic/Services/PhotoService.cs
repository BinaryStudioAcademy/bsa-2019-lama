using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Photo.DataAccess;
using Photo.DataAccess.Blob;
using Photo.Domain.BlobModels;
using Photo.BusinessLogic.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Photo.BusinessLogic.Services
{
    public class PhotoService: IPhotoService
    {
        AppDbContext _db;
        public PhotoService(AppDbContext context)
        {
            _db = context;
        }

        private PhotoBlobStore _store = new PhotoBlobStore();

        public IEnumerable<PhotoDocument> LoadPhotos()
        {
            return _db.Photos;
        }

        public async Task SaveToBlobStorage(PhotoReceived[] photos)
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
