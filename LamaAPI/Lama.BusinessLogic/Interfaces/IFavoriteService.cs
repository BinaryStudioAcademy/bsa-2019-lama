using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IFavoriteService
    {
        Task<IEnumerable<PhotoDocument>> GetFavoritesPhotos(int userId);
        Task<IEnumerable<int>> GetFavoritesIds(int userId);
        Task<int> CreateFavorite(Favorite favorites);
        Task<int> DeleteFavorite(int id);
    }
}
