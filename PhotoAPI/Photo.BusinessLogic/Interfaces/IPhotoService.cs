using Photo.Domain.BlobModels;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IPhotoService : IBaseService<PhotoDocument>
    {
        System.Threading.Tasks.Task Create(PhotoReceived[] items);
        System.Threading.Tasks.Task<long> GetCount();
    }
}
