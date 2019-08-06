using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Photo.DataAccess.Blob;

namespace Photo.BusinessLogic.Services
{
    public class PhotoService
    {

        private PhotoBlobStore _store = new PhotoBlobStore();

        public async Task SaveToBlobStorage(string[] photos)
        {
            await _store.LoadPhotosToBlob(photos);
        }
    }
}
