using Photo.Domain.BlobModels;

using System.Threading.Tasks;
using Photo.Domain.DataTransferObjects;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IPhotoService : IBaseService<PhotoDocument>
    {
        Task Create(PhotoReceived[] items);
        Task<UpdatedPhotoResultDTO> UpdateImage(UpdatePhotoDTO updatePhotoDTO);
        Task<PhotoDocument> UpdateWithSharedLink(int id, string sharedLink);
    }
}
