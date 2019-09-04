using System.Collections.Generic;
using System.Threading.Tasks;
using Nest;
using Processors.Domain.BlobModel;
using Processors.Domain.DTO;


namespace Processors.DataAccess.Interfaces
{
    public interface IElasticStorage
    {
        Task<string> GetBlobId(long documentId);
        Task UpdateHashAsync(long id, HasDTO has);
        Task UpdateThumbnailsAsync(long id, Processors.Domain.ThumbnailUpdateDTO thumbnailUpdate);
        Task<bool> ExistAsync(long id);
        Task UpdateImageTagsAsync(long imageId, ImageTagsAsRaw imageTagsAsRawString);
        Task<IEnumerable<PhotoDocument>> GetUserPhotos(int userId);
    }
}
