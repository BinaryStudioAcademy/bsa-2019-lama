using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.Domain.DbModels;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class SharedAlbumRepository : IRepository<SharedAlbum>
    {
        private readonly ApplicationDbContext _db;

        public SharedAlbumRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(SharedAlbum item)
        {
            await _db.SharedAlbums.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<SharedAlbum> ReadAsync(int id)
        {
            return await _db.SharedAlbums.FindAsync(id);
        }

        public async Task UpdateAsync(int id, SharedAlbum item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            SharedAlbum s = await ReadAsync(id);
            if (s != null)
                _db.SharedAlbums.Remove(s);
            await _db.SaveChangesAsync();
        }

        public async Task<List<SharedAlbum>> GetAllAsync()
        {
            return await _db.SharedAlbums.ToListAsync();
        }

        public async Task<List<SharedAlbum>> FindAsync(Func<SharedAlbum, bool> predicate)
        {
            return await _db.SharedAlbums.Where(predicate).AsQueryable().ToListAsync();
        }
    }
}
