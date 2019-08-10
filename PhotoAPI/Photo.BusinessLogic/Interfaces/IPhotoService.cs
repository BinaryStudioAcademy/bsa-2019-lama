using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;

using System.Threading.Tasks;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IPhotoService : IBaseService<PhotoDocument>
    {

        Task<int> Create(PhotoReceived item);
        Task<int> CreateAvatar(PhotoReceived item);
        Task<UpdatedPhotoResultDTO> UpdateImage(UpdatePhotoDTO updatePhotoDTO);
        Task<PhotoDocument> UpdateWithSharedLink(int id, string sharedLink);

    }
}
