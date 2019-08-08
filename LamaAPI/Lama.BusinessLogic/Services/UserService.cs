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
    public class UserService: IBaseService<User>
    {
        UserRepository _repo;
        public UserService(UserRepository repo)
        {
            _repo = repo;
        }
        public async Task Create(User item)
        {
            await _repo.CreateAsync(item);
        }

        public async Task<int> CreateWithFeedback(User item)
        {
            return await _repo.CreateWithFeedbackAsync(item);
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
            return await _repo.ReadAsync(id);
        }

        public User GetByEmail(string email)
        {
            return _repo.Find(u => u.Email == email).FirstOrDefault();
        }

        public Task Update(User item)
        {
            throw new NotImplementedException();
        }
    }
}
