using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.Domain.DbModels;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class LikeRepository : IRepository<Like>
    {
        private readonly ApplicationDbContext _db;

        public LikeRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(Like item)
        {
            await _db.Likes.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<Like> ReadAsync(int id)
        {
            return await _db.Likes.FindAsync(id);
        }

        public async Task UpdateAsync(int id, Like item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            Like l = await ReadAsync(id);
            if (l != null)
                _db.Likes.Remove(l);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Like>> GetAllAsync()
        {
            return await _db.Likes.ToListAsync();
        }

        public async Task<List<Like>> FindAsync(Func<Like, bool> predicate)
        {
            return await _db.Likes.Where(predicate).AsQueryable().ToListAsync();
        }
    }
}
