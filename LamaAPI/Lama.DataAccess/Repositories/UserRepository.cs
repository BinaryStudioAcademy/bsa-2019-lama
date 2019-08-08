using System;
using System.Linq;
using System.Threading.Tasks;
using Lama.Domain.DbModels;
using Lama.DataAccess.Interfaces;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess.Repositories
{
    //public class UserDTO
    //{
    //    public string Email {get;set;}
    //    public string FirstName { get; set; }
    //    public string LastName { get; set; }
    //}
    public class UserRepository : IRepository<User>
    {
        private readonly ApplicationDbContext _db;

        public UserRepository(ApplicationDbContext context)
        {
            _db = context;
        }

        public async Task CreateAsync(User item)
        {
            await _db.Users.AddAsync(item);
            await _db.SaveChangesAsync();
        }

        public async Task<int> CreateWithFeedbackAsync(User item)
        {
            await _db.Users.AddAsync(item);
            await _db.SaveChangesAsync();
            var id = (await _db.Users.LastOrDefaultAsync()).Id;

            return id;
        }

        public async Task<User> ReadAsync(int id)
        {
            return await _db.Users.FindAsync(id);
        }

        public async Task UpdateAsync(int id, User item)
        {
            _db.Entry(item).State = EntityState.Modified;
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            User u = await ReadAsync(id);
            if (u != null)
                _db.Users.Remove(u);
            await _db.SaveChangesAsync();
        }

        public async Task<List<User>> GetAllAsync()
        {
            return await _db.Users.ToListAsync();
        }
        // changed to syncronous method because throwing
        //InvalidOperationException: The source IQueryable doesn't implement IAsyncEnumerable
        // will be fixed in future
        public List<User> Find(Func<User, bool> predicate)
        {
            return  _db.Users.Where(predicate).AsQueryable().ToList();
        }

        public async Task<List<User>> FindAsync(Func<User, bool> predicate)
        {
            return await _db.Users.Where(predicate).AsQueryable().ToListAsync();
        }
    }
}
