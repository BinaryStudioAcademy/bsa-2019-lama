using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.DataAccess.Models;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class SharedPhotoRepository : IRepository<SharedPhoto>
    {
        private readonly ApplicationDbContext _db;

        public SharedPhotoRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(SharedPhoto item)
        {
            await _db.SharedPhotos.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<SharedPhoto> ReadAsync(int id)
        {
            return await _db.SharedPhotos.FindAsync(id);
        }

        public async Task UpdateAsync(int id, SharedPhoto item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            SharedPhoto s = await ReadAsync(id);
            if (s != null)
                _db.SharedPhotos.Remove(s);
            await _db.SaveChangesAsync();
        }

        public async Task<List<SharedPhoto>> GetAllAsync()
        {
            return await _db.SharedPhotos.ToListAsync();
        }

        public async Task<IEnumerable<SharedPhoto>> FindAsync(Func<SharedPhoto, bool> predicate)
        {
            return _db.SharedPhotos.Where(predicate);
        }
    }
}
