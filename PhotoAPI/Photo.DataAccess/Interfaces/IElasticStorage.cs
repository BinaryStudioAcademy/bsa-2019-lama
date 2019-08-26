using Nest;
using Photo.Domain.BlobModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Photo.DataAccess.Interfaces
{
    public interface IElasticStorage
    {
        Task<CreateResponse> CreateAsync(PhotoDocument item);
        Task<CreateResponse> CreateAsync(int id, PhotoDocument item);

        Task DeleteAsync(int id);

        Task UpdateAsync(PhotoDocument item);
        Task UpdatePartiallyAsync(int id, object partialObject);
        Task UpdatePartiallyAsync<TPartialObject>(int id, TPartialObject partialObject)
            where TPartialObject : class;

        Task<PhotoDocument> Get(int elasticId);
        Task<IEnumerable<PhotoDocument>> Find(int id, string criteria);
        Task<Dictionary<string, List<string>>> FindFields(int id, string criteria);
        Task<IEnumerable<PhotoDocument>> Get();
        Task<IEnumerable<PhotoDocument>> GetDeletedPhoto(int userId);
        Task<IEnumerable<PhotoDocument>> GetUserPhotos(int userId);
        Task<IEnumerable<PhotoDocument>> GetUserPhotosRange(int userId, int startIndex, int count);
    }
}
