using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.DataAccess.Models;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class VideoRepository : IRepository<Video>
    {
        private readonly ApplicationDbContext _db;

        public VideoRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(Video item)
        {
            await _db.Videos.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<Video> ReadAsync(int id)
        {
            return await _db.Videos.FindAsync(id);
        }

        public async Task UpdateAsync(int id, Video item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            Video v = await ReadAsync(id);
            if (v != null)
                _db.Videos.Remove(v);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Video>> GetAllAsync()
        {
            return await _db.Videos.ToListAsync();
        }

        public async Task<IEnumerable<Video>> FindAsync(Func<Video, bool> predicate)
        {
            return _db.Videos.Where(predicate);
        }
    }
}
