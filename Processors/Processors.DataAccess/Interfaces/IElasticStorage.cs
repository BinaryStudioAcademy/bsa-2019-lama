using System.Threading.Tasks;
using Processors.Domain.DTO;

namespace Processors.DataAccess.Interfaces
{
    public interface IElasticStorage
    {
        Task<string> GetBlobId(long documentId);
        Task UpdateThumbnailsAsync(long id, Processors.Domain.ThumbnailUpdateDTO thumbnailUpdate);
        Task<bool> ExistAsync(long id);
        Task UpdateImageTagsAsync(long imageId, ImageTagsDTO imageTagsAsRawString);
    }
}
