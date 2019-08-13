using Lama.Domain.BlobModels;
using Lama.Domain.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IFavoriteService
    {
        Task<IEnumerable<PhotoDocument>> GetFavoritesPhotos(int userId);
        Task<IEnumerable<int>> GetFavoritesIds(int userId);
        Task UpdateState(FavoriteDTO[] favorites, int userId);
    }
}
