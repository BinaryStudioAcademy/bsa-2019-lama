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
using Photo.BusinessLogic.Exceptions;

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
                byte[] blob = System.Convert.FromBase64String(base64[i]);
                var id = await _store.LoadPhotoToBlob(blob);
                var id64 = await _store.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(blob, 64));
                var id256 = await _store.LoadPhotoToBlob(ImageProcessingsService.CreateThumbnail(blob, 256));
                await SaveToElastic(new PhotoDocument
                {
                    BlobId = id,
                    Blob64Id = id64,
                    Blob256Id = id256,
                    CategoryId = 0,
                    UploadDate = DateTime.Now,
                    Description = photos[i].Description
                });
            }
        }

        public async Task SaveToElastic(PhotoDocument photo)
        {
            // save to fake db now
            await _db.Photos.AddAsync(photo);
            await _db.SaveChangesAsync();
        }

        public async Task<PhotoDocument> UpdateWithSharedLink(int id, string sharedLink)
        {
            var photoDocument = _db.Photos.Find(id);
            if (photoDocument == null)
            {
                throw new NotFoundException(nameof(photoDocument), id);
            }

            photoDocument.SharedLink = sharedLink;

            await _db.SaveChangesAsync();

            return photoDocument;

        }
    }
}
