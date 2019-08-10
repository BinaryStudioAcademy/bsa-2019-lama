using Photo.Domain.BlobModels;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IPhotoService : IBaseService<PhotoDocument>
    {
        System.Threading.Tasks.Task<int> Create(PhotoReceived item);
        System.Threading.Tasks.Task<int> CreateAvatar(PhotoReceived item);

    }
}
