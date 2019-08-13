using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Lama.DataAccess;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.BusinessLogic.Interfaces;
using System.Linq;
using Lama.Domain.DTO;

namespace Lama.BusinessLogic.Services
{
    public class FavoriteService : BaseService<Favorite>, IFavoriteService
    {
        private readonly IPhotoService _photoService;
        
        public FavoriteService(IPhotoService photoService, ApplicationDbContext context)
            :base(context)
        {
            _photoService = photoService;
        }

        public async Task<IEnumerable<PhotoDocument>> GetFavoritesPhotos(int userId)
        {

            List<PhotoDocument> photos = new List<PhotoDocument>();
            IEnumerable<Favorite> favorites = await Context.Favorites.Where(f=> f.UserId == userId).ToListAsync();
            foreach(var far in favorites)
            {
                PhotoDocument pd = await _photoService.Get(far.PhotoId);
                photos.Add(pd);
            }
            return photos;
        }

        public async Task<IEnumerable<int>> GetFavoritesIds(int userId)
        {

            List<int> photos = new List<int>();
            IEnumerable<Favorite> favorites = await Context.Favorites.Where(f => f.UserId == userId).ToListAsync();
            foreach (var far in favorites)
            {
                photos.Add(far.PhotoId);
            }
            return photos;
        }

        public async Task UpdateState(FavoriteDTO[] favorites, int userId)
        {
            foreach(var fav in favorites)
            {
                if (fav.State == FavoriteState.MarkedToFavorite)
                    await Create(new Favorite { PhotoId = fav.PhotoId, UserId = userId });
                if (fav.State == FavoriteState.UnmarkedFavorite)
                {
                    Favorite f = await Context.Favorites.Where(e => e.PhotoId == fav.PhotoId && e.UserId == userId).FirstAsync();
                    await Delete(f);
                }
            }
        }
    }
}
