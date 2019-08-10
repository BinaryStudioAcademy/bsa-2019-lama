using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;

using System.Threading.Tasks;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IPhotoService : IBaseService<PhotoDocument>
    {
        Task Create(PhotoReceived[] items);
        Task<UpdatedPhotoResultDTO> UpdateImage(UpdatePhotoDTO updatePhotoDTO);
        Task<PhotoDocument> UpdateWithSharedLink(int id, string sharedLink);

        Task MarkPhotoAsDeleted(int photoId);
        Task<DeletedPhotoDTO[]> GetDeletedPhotos();
        Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete);
        Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore);
    }
}
