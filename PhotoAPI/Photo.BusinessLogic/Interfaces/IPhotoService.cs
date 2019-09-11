using Nest;
using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IPhotoService : IBaseService<PhotoDocument>
    {

        Task<IEnumerable<CreatePhotoResultDTO>> Create(IEnumerable<CreatePhotoDTO> item);
        Task<string> CreateAvatar(CreatePhotoDTO item);
        Task SendDuplicates(List<int> duplicates);
        Task<IEnumerable<PhotoDocumentDTO>> FindSimilarPhotos(int photoId);
        Task<IEnumerable<CreatePhotoResultDTO>> CreateDuplicates(IEnumerable<CreatePhotoResultDTO> duplicates);
        Task<UpdatedPhotoResultDTO> UpdateImage(UpdatePhotoDTO updatePhotoDTO);
        Task<IEnumerable<PhotoDocument>> GetManyByIds(IEnumerable<int> elasticIds);
        Task<PhotoDocument> UpdateWithSharedLink(int id, string sharedLink);
        Task<IEnumerable<IEnumerable<CreatePhotoResultDTO>>> FindDuplicates(int userId);
        Task<IEnumerable<PhotoDocument>> Find(int id, string criteria);
        Task<Dictionary<string, List<string>>> FindFields(int id, string criteria);
        Task MarkPhotoAsDeleted(int photoId);
        Task<List<Byte[]>> GetPhotos(List<string> values);
        Task<string> GetPhoto(string value);
        Task<string> GetAvatar(string value);
        Task<DeletedPhotoDTO[]> GetDeletedPhotos(int userId);
        Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete);
        Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore);
        Task<IEnumerable<PhotoDocument>> GetUserPhotos(int userId);
        Task<IEnumerable<PhotoDocument>> GetUserPhotosRange(int userId, int startId, int count);
        Task<int> CheckAuthorPhoto(Tuple<int, int> tuple);
    }
}
