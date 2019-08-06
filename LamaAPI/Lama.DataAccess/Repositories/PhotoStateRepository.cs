using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.Domain.DbModels;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class PhotoStateRepository : IRepository<PhotoState>
    {
        private readonly ApplicationDbContext _db;

        public PhotoStateRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(PhotoState item)
        {
            await _db.PhotoStates.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<PhotoState> ReadAsync(int id)
        {
            return await _db.PhotoStates.FindAsync(id);
        }

        public async Task UpdateAsync(int id, PhotoState item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            PhotoState p = await ReadAsync(id);
            if (p != null)
                _db.PhotoStates.Remove(p);
            await _db.SaveChangesAsync();
        }

        public async Task<List<PhotoState>> GetAllAsync()
        {
            return await _db.PhotoStates.ToListAsync();
        }

        public async Task<IEnumerable<PhotoState>> FindAsync(Func<PhotoState, bool> predicate)
        {
            return _db.PhotoStates.Where(predicate);
        }
    }
}
