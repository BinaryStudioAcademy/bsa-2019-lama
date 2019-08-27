using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Photo;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IFavoriteService
    {
        Task<IEnumerable<PhotoDocumentDTO>> GetFavoritesPhotos(int userId);
        Task<IEnumerable<int>> GetFavoritesPhotosId(int userId);
        Task<int> CreateFavorite(Favorite favorite);
        Task<int> DeleteFavorite(int userId, int photoId);
        Task<int> DeleteFavoritesForUser(int userId);
        Task<int> DeleteSelectedFavorites(int userId, int[] favorites);
    }
}
