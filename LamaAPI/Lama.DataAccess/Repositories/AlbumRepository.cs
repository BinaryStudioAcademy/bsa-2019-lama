using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.DataAccess.Models;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class AlbumRepository : IRepository<Album>
    {
        private readonly ApplicationDbContext _db;

        public AlbumRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(Album item)
        {
            await _db.Albums.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<Album> ReadAsync(int id)
        {
            return await _db.Albums.FindAsync(id);
        }

        public async Task UpdateAsync(int id, Album item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            Album a = await ReadAsync(id);
            if (a != null)
                _db.Albums.Remove(a);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Album>> GetAllAsync()
        {
            return await _db.Albums.ToListAsync();
        }

        public async Task<IEnumerable<Album>> FindAsync(Func<Album, bool> predicate)
        {
            return _db.Albums.Where(predicate);
        }
    }
}
