using System.Threading.Tasks;

namespace Processors.DataAccess.Interfaces
{
    public interface IElasticStorage
    {
        Task<string> GetBlobId(long documentId);
        Task UpdateThumbnailsAsync(long id, Processors.Domain.ThubnailUpdateDTO thubnailUpdate);
        Task<bool> ExistAsync(long id);
    }
}
