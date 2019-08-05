using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.DataAccess.Models;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class FavoriteRepository : IRepository<Favorite>
    {
        private readonly ApplicationDbContext _db;

        public FavoriteRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(Favorite item)
        {
            await _db.Favorites.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<Favorite> ReadAsync(int id)
        {
            return await _db.Favorites.FindAsync(id);
        }

        public async Task UpdateAsync(int id, Favorite item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            Favorite f = await ReadAsync(id);
            if (f != null)
                _db.Favorites.Remove(f);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Favorite>> GetAllAsync()
        {
            return await _db.Favorites.ToListAsync();
        }

        public async Task<IEnumerable<Favorite>> FindAsync(Func<Favorite, bool> predicate)
        {
            return _db.Favorites.Where(predicate);
        }
    }
}
