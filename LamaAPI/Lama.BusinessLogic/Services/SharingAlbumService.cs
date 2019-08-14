using Lama.BusinessLogic.Exceptions;
using Lama.DataAccess;
using Lama.Domain.DbModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Services
{
    public class SharingAlbumService : BaseService<Album>
    {
        public SharingAlbumService(ApplicationDbContext context)
            : base(context)
        {
        }

        public async Task<Album> Get(int id)
        {
            throw new System.NotImplementedException();
        }

        public Task Delete(int id)
        {
            throw new System.NotImplementedException();
        }

        public async Task SharingAlbum(SharedAlbum sharedAlbum)
        {
			var album = (await Context.SharedAlbums.FirstOrDefaultAsync(a => a.AlbumId == sharedAlbum.AlbumId && a.userId == sharedAlbum.userId));
			
			if(album != null)
			{
				await Context.SharedAlbums.AddAsync(sharedAlbum);
				await Context.SaveChangesAsync();
			}
        }
    }
}
