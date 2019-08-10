using Lama.DataAccess;
using Lama.Domain.DbModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lama.BusinessLogic.Exceptions;

namespace Lama.BusinessLogic.Services
{
    public class UserService: BaseService<User>
    {
        private readonly ApplicationDbContext dataContext;

        public UserService(ApplicationDbContext dbContext)
        {
            dataContext = dbContext;
        }

        public async Task<User> Get(int id)
        {
            return await dataContext.Users.SingleAsync(user => user.Id == id);
        }

        public async Task<User> GetByEmail(string email)
        {
            return await dataContext.Users.SingleAsync(user => user.Email == email);
        }

        public async Task Update(User user)
        {
            var updateUser = dataContext.Users.FirstOrDefault(u => u.Id == user.Id);

            if (updateUser == null)
            {
                throw new NotFoundException(nameof(User), user.Id);
            }
            
            updateUser.FirstName = user.FirstName;
            updateUser.LastName = user.LastName;
            updateUser.Email = user.Email;

            await dataContext.SaveChangesAsync();
        }
    }
}
