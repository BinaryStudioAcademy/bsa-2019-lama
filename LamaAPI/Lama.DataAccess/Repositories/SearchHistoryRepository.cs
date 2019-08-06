using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.Domain.DbModels;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class SearchHistoryRepository : IRepository<SearchHistory>
    {
        private readonly ApplicationDbContext _db;

        public SearchHistoryRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(SearchHistory item)
        {
            await _db.SearchHistories.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<SearchHistory> ReadAsync(int id)
        {
            return await _db.SearchHistories.FindAsync(id);
        }

        public async Task UpdateAsync(int id, SearchHistory item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            SearchHistory s = await ReadAsync(id);
            if (s != null)
                _db.SearchHistories.Remove(s);
            await _db.SaveChangesAsync();
        }

        public async Task<List<SearchHistory>> GetAllAsync()
        {
            return await _db.SearchHistories.ToListAsync();
        }

        public async Task<IEnumerable<SearchHistory>> FindAsync(Func<SearchHistory, bool> predicate)
        {
            return _db.SearchHistories.Where(predicate);
        }
    }
}
