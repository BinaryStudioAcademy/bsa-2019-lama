using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.DataAccess.Models;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class CommentRepository : IRepository<Comment>
    {
        private readonly ApplicationDbContext _db;

        public CommentRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(Comment item)
        {
            await _db.Comments.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<Comment> ReadAsync(int id)
        {
            return await _db.Comments.FindAsync(id);
        }

        public async Task UpdateAsync(int id, Comment item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            Comment c = await ReadAsync(id);
            if (c != null)
                _db.Comments.Remove(c);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Comment>> GetAllAsync()
        {
            return await _db.Comments.ToListAsync();
        }

        public async Task<IEnumerable<Comment>> FindAsync(Func<Comment, bool> predicate)
        {
            return _db.Comments.Where(predicate);
        }
    }
}
