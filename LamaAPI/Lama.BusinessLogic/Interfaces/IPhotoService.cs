using Lama.Domain.BlobModels;
using Lama.Domain.DataTransferObjects.Photo;

using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IPhotoService 
    {
        Task<HttpResponseMessage> CreateAll(PhotoReceived[] photos);
        Task<IEnumerable<PhotoDocument>> GetAll();
        Task<UpdatedPhotoResultDTO> UpdatePhoto(UpdatePhotoDTO updatePhotoDTO);

        Task MarkPhotoAsDeleted(int photosToDeleteId);
        Task<DeletedPhotoDTO[]> GetDeletedPhotos();
        Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete);
        Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore);
    }
}
