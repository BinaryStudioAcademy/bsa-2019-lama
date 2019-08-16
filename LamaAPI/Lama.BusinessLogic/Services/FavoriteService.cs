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
            : base(context)
        {
            _photoService = photoService;
        }

        public async Task<IEnumerable<PhotoDocument>> GetFavoritesPhotos(int userId)
        {

            List<PhotoDocument> photos = new List<PhotoDocument>();
            IEnumerable<Favorite> favorites = await Context.Favorites.Where(f => f.UserId == userId).ToListAsync();
            foreach (var far in favorites)
            {
                PhotoDocument pd = await _photoService.Get(far.PhotoId);
                if (pd == null)
                {
                    await DeleteFavorite(userId, far.PhotoId);
                }
                else if (!pd.IsDeleted)
                    photos.Add(pd);
            }
            return photos;
        }

        public async Task<IEnumerable<int>> GetFavoritesPhotosId(int userId)
        {

            List<int> photos = new List<int>();
            IEnumerable<Favorite> favorites = await Context.Favorites.Where(f => f.UserId == userId).ToListAsync();
            foreach (var far in favorites)
            {
                photos.Add(far.PhotoId);
            }
            return photos;
        }

        public async Task<IEnumerable<int>> GetFavoritesIds(int userId)
        {

            List<int> photos = new List<int>();
            IEnumerable<Favorite> favorites = await Context.Favorites.Where(f => f.UserId == userId).ToListAsync();
            foreach (var far in favorites)
            {
                photos.Add(far.Id);
            }
            return photos;
        }

        public async Task<int> CreateFavorite(Favorite favorite)
        {
            await Create(favorite);
            return (await Context.Favorites.LastAsync()).Id;
        }

        public async Task<int> DeleteFavorite(int userId, int photoId)
        {
            Favorite fav = await Context.Favorites.Where(f => f.UserId == userId && f.PhotoId == photoId).FirstOrDefaultAsync();
            if (fav != null)
            {
                await Delete(fav);
                return fav.Id;
            }
            return -1;
        }

        public async Task<int> DeleteFavoritesForUser(int userId)
        {
            IEnumerable<int> favorites = await GetFavoritesIds(userId);
            foreach (var f in favorites)
            {
                Favorite fav = await Context.Favorites.FindAsync(f);
                Context.Favorites.Remove(fav);
            }
            return await Context.SaveChangesAsync();
        }
    }
}
