using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.Domain.DbModels;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class LocationRepository : IRepository<Location>
    {
        private readonly ApplicationDbContext _db;

        public LocationRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(Location item)
        {
            await _db.Locations.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<Location> ReadAsync(int id)
        {
            return await _db.Locations.FindAsync(id);
        }

        public async Task UpdateAsync(int id, Location item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            Location l = await ReadAsync(id);
            if (l != null)
                _db.Locations.Remove(l);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Location>> GetAllAsync()
        {
            return await _db.Locations.ToListAsync();
        }

        public async Task<IEnumerable<Location>> FindAsync(Func<Location, bool> predicate)
        {
            return _db.Locations.Where(predicate);
        }
    }
}
