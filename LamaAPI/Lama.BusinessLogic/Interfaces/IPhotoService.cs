using Lama.Domain.BlobModels;
using Lama.Domain.DTO.Photo;
using Lama.Domain.DbModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IPhotoService 
    {
        Task<IEnumerable<UploadPhotoResultDTO>> CreateAll(CreatePhotoDTO[] photos);
        Task<Photo> CreateAvatar(CreatePhotoDTO item);
        Task<IEnumerable<PhotoDocument>> GetAll();
        Task<UpdatedPhotoResultDTO> UpdatePhoto(UpdatePhotoDTO updatePhotoDTO);
        Task<PhotoDocument> Get(int id);
        Task MarkPhotoAsDeleted(int photosToDeleteId);
        Task<DeletedPhotoDTO[]> GetDeletedPhotos();
        Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete);
        Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore);
        Task<IEnumerable<PhotoDocument>> GetUserPhotos(int id);
    }
}
