using Photo.Domain.BlobModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Photo.DataAccess.Interfaces
{
    public interface IElasticStorage
    {
        [System.Obsolete("Is not thread safe. Try not to use it")]
        long GenerateId();

        Task CreateAsync(PhotoDocument item);
        Task CreateAsync(int id, PhotoDocument item);

        Task DeleteAsync(int id);

        Task UpdateAsync(PhotoDocument item);
        Task UpdatePartiallyAsync(int id, object partialObject);
        Task UpdatePartiallyAsync<TPartialObject>(int id, TPartialObject partialObject)
            where TPartialObject : class;

        Task<PhotoDocument> Get(int elasticId);
        Task<IEnumerable<PhotoDocument>> Get();
        Task<IEnumerable<PhotoDocument>> GetDeletedPhoto();
        Task<IEnumerable<PhotoDocument>> GetUserPhotos(int userId);
    }
}
