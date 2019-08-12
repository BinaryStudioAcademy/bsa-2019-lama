using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IPhotoService : IBaseService<PhotoDocument>
    {

        Task<IEnumerable<int>> Create(PhotoReceived[] item);
        Task<int> CreateAvatar(PhotoReceived item);
        Task<UpdatedPhotoResultDTO> UpdateImage(UpdatePhotoDTO updatePhotoDTO);
        Task<PhotoDocument> UpdateWithSharedLink(int id, string sharedLink);

        Task MarkPhotoAsDeleted(int photoId);
        Task<DeletedPhotoDTO[]> GetDeletedPhotos();
        Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete);
        Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore);
        Task<IEnumerable<PhotoDocument>> GetUserPhotos(int userId);
    }
}
