using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IFavoriteService
    {
        Task<IEnumerable<PhotoDocument>> GetFavoritesPhotos(int userId);
        Task<IEnumerable<int>> GetFavoritesPhotosId(int userId);
        Task<int> CreateFavorite(Favorite favorite);
        Task<int> DeleteFavorite(int userId, int photoId);
        Task<int> DeleteFavoritesForUser(int userId);
    }
}
