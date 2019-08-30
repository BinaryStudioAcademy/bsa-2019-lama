using System.Collections.Generic;
using System.Threading.Tasks;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;
using Lama.Domain.DTO.Photo;

namespace Lama.BusinessLogic.Interfaces
{
    public interface ISharingPhotoService
    {
        Task<SharedPhotoDTO> Get(int id);
        Task<IEnumerable<PhotoAlbumDTO>> GetUsersSharedPhoto(int id);
        Task<PhotoDocument> UpdatePhotoDocumentWithSharedLink(int id, string sharedLink);
        Task Delete(int id);
        Task ProcessSharedPhoto(SharedPhoto sharedPhoto);
        Task<int> Create(Photo item);
        Task<int> Delete(Photo entity);
        Task<IEnumerable<Photo>> FindAll();
        Task<Photo> Update(Photo t, object key);
    }
}