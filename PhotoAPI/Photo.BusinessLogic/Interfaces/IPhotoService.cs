using Photo.Domain.BlobModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Photo.BusinessLogic.Interfaces
{
    interface IPhotoService
    {
        Task SaveToBlobStorage(PhotoReceived[] photos);
        IEnumerable<PhotoDocument> LoadPhotos();
    }
}
