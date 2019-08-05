using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.DataAccess.Models;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class PhotoAlbumRepository : IRepository<PhotoAlbum>
    {
        private readonly ApplicationDbContext _db;

        public PhotoAlbumRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(PhotoAlbum item)
        {
            await _db.PhotoAlbums.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<PhotoAlbum> ReadAsync(int id)
        {
            return await _db.PhotoAlbums.FindAsync(id);
        }

        public async Task UpdateAsync(int id, PhotoAlbum item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            PhotoAlbum p = await ReadAsync(id);
            if (p != null)
                _db.PhotoAlbums.Remove(p);
            await _db.SaveChangesAsync();
        }

        public async Task<List<PhotoAlbum>> GetAllAsync()
        {
            return await _db.PhotoAlbums.ToListAsync();
        }

        public async Task<IEnumerable<PhotoAlbum>> FindAsync(Func<PhotoAlbum, bool> predicate)
        {
            return _db.PhotoAlbums.Where(predicate);
        }
    }
}
