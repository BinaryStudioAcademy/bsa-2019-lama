using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.Domain.DbModels;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class PhotoRepository : IRepository<Photo>
    {
        private readonly ApplicationDbContext _db;

        public PhotoRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(Photo item)
        {
            await _db.Photos.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<Photo> ReadAsync(int id)
        {
            return await _db.Photos.FindAsync(id);
        }

        public async Task UpdateAsync(int id, Photo item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            Photo p = await ReadAsync(id);
            if (p != null)
                _db.Photos.Remove(p);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Photo>> GetAllAsync()
        {
            return await _db.Photos.ToListAsync();
        }

        public async Task<List<Photo>> FindAsync(Func<Photo, bool> predicate)
        {
            return await _db.Photos.Where(predicate).AsQueryable().ToListAsync();
        }
    }
}
