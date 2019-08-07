using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.Domain.DbModels;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class CategoryRepository : IRepository<Category>
    {
        private readonly ApplicationDbContext _db;

        public CategoryRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(Category item)
        {
            await _db.Categories.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<Category> ReadAsync(int id)
        {
            return await _db.Categories.FindAsync(id);
        }

        public async Task UpdateAsync(int id, Category item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            Category c = await ReadAsync(id);
            if (c != null)
                _db.Categories.Remove(c);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Category>> GetAllAsync()
        {
            return await _db.Categories.ToListAsync();
        }

        public async Task<List<Category>> FindAsync(Func<Category, bool> predicate)
        {
            return await _db.Categories.Where(predicate).AsQueryable().ToListAsync();
        }
    }
}
