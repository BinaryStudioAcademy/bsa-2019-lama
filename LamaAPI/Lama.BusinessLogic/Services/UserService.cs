using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess.Interfaces;
using Lama.Domain.DbModels;
using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Lama.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Lama.BusinessLogic.Services
{
    public class UserService : IBaseService<User>
    {
        private readonly IUnitOfWork _context;
        public UserService(IUnitOfWork context)
        {
            _context = context;
        }
        public async Task Create(User item)
        {
            await _context.GetRepository<User>().InsertAsync(item);
            await _context.SaveAsync();
        }

        public async Task<int> CreateWithFeedback(User item)
        {
            await _context.GetRepository<User>().InsertAsync(item);
            await _context.SaveAsync();
            return (await _context.GetRepository<User>().GetAsync(u => u.Email == item.Email)).FirstOrDefault().Id;
        }


        public Task Delete(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<User>> FindAll()
        {
            throw new NotImplementedException();
        }

        public async Task<User> Get(int id)
        {
            return (await _context.GetRepository<User>().GetAsync(u => u.Id == id)).FirstOrDefault();
        }

        public async Task<User> GetByEmail(string email)
        {
            return (await _context.GetRepository<User>().GetAsync(u => u.Email == email)).FirstOrDefault();
        }

        public async Task Update(User user)
        {
            _context.Update<User>(user);
            await _context.SaveAsync();
        }     
    }
}


