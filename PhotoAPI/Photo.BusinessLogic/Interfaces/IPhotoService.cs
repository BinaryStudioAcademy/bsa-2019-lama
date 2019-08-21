using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IPhotoService : IBaseService<PhotoDocument>
    {

        Task<IEnumerable<CreatePhotoResultDTO>> Create(CreatePhotoDTO[] item);
        Task<int> CreateAvatar(CreatePhotoDTO item);
        Task<UpdatedPhotoResultDTO> UpdateImage(UpdatePhotoDTO updatePhotoDTO);
        Task<PhotoDocument> UpdateWithSharedLink(int id, string sharedLink);
        Task<IEnumerable<PhotoDocument>> Find(string criteria);
        Task MarkPhotoAsDeleted(int photoId);
        Task<List<Byte[]>> GetPhotos(PhotoDocument[] values);
        Task<string> GetPhoto(string value);
        Task<DeletedPhotoDTO[]> GetDeletedPhotos(int userId);
        Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete);
        Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore);
        Task<IEnumerable<PhotoDocument>> GetUserPhotos(int userId);
    }
}
