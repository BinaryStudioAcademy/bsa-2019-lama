using Lama.DataAccess;
using Lama.Domain.DbModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        public async Task Update(User user)
        {
            var updateUser = dataContext.Users.Where(u => u.Id == user.Id).FirstOrDefault();
            updateUser.FirstName = user.FirstName;
            updateUser.LastName = user.LastName;
            updateUser.Email = user.Email;

            await dataContext.SaveChangesAsync();
        }
    }
}
