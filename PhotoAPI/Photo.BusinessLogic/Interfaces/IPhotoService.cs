using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;

using System.Threading.Tasks;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IPhotoService : IBaseService<PhotoDocument>
    {
        Task Create(PhotoReceived[] items);
        Task<UpdatedPhotoResultDTO> UpdateImage(UpdatePhotoDTO updatePhotoDTO);
    }
}
