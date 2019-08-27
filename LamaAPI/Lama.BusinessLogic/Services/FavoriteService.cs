using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Lama.DataAccess;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.BusinessLogic.Interfaces;
using System.Linq;
using Lama.Domain.DTO;
using AutoMapper;
using Lama.Domain.DTO.Photo;
using Lama.Domain.DTO.Reaction;

namespace Lama.BusinessLogic.Services
{
    public class FavoriteService : BaseService<Favorite>, IFavoriteService
    {
        private readonly IMapper mapper;
        private readonly IPhotoService _photoService;

        public FavoriteService(IPhotoService photoService, ApplicationDbContext context, IMapper mapper)
            : base(context)
        {
            this.mapper = mapper;
            _photoService = photoService;
        }

        public async Task<IEnumerable<PhotoDocumentDTO>> GetFavoritesPhotos(int userId)
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

            PhotoDocumentDTO[] photoDocumentDTOs = mapper.Map<PhotoDocumentDTO[]>(photos);
            foreach(PhotoDocumentDTO photoDocumentDTO in photoDocumentDTOs)
            {
                photoDocumentDTO.Reactions =
                    mapper.Map<LikeDTO[]>(
                    Context.Likes
                    .Where(l => l.PhotoId == photoDocumentDTO.Id)
                    .ToArray());

                foreach (LikeDTO like in photoDocumentDTO.Reactions)
                {
                    if (like.Photo != null)
                    {
                        like.Photo.Likes = null;
                    }
                }
            }



            return photoDocumentDTOs;
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
            Favorite fav = await Context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.PhotoId == photoId);
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

        public async Task<int> DeleteSelectedFavorites(int userId, int[] photos)
        {
            foreach(var p in photos)
            {
                var fav = await Context.Favorites.FirstOrDefaultAsync(f => f.UserId == userId && f.PhotoId == p);
                Context.Remove(fav);
            }
            return await Context.SaveChangesAsync();
        }
    }
}
