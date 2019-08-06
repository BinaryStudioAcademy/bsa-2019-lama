using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.Domain.DbModels;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    class NotificationRepository : IRepository<Notification>
    {
        private readonly ApplicationDbContext _db;

        public NotificationRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(Notification item)
        {
            await _db.Notifications.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<Notification> ReadAsync(int id)
        {
            return await _db.Notifications.FindAsync(id);
        }

        public async Task UpdateAsync(int id, Notification item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            Notification n = await ReadAsync(id);
            if (n != null)
                _db.Notifications.Remove(n);
            await _db.SaveChangesAsync();
        }

        public async Task<List<Notification>> GetAllAsync()
        {
            return await _db.Notifications.ToListAsync();
        }

        public async Task<IEnumerable<Notification>> FindAsync(Func<Notification, bool> predicate)
        {
            return _db.Notifications.Where(predicate);
        }
    }
}
