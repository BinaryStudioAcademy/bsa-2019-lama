using Lama.Domain.BlobModels;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    interface IPhotoService
    {
        Task<HttpResponseMessage> SendPhotoToApi(PhotoReceived[] photos);
        IEnumerable<PhotoDocument> LoadPhotosFromApi();
    }
}
