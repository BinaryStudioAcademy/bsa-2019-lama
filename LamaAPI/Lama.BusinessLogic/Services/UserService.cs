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
        public UserService(ApplicationDbContext dbContext)
            :base(dbContext)
        {

        }

        public async Task<User> Get(int id)
        {
            return await Context.Users.SingleAsync(user => user.Id == id);
        }

        public async Task Update(User user)
        {
            var updateUser = Context.Users.Where(u => u.Id == user.Id).FirstOrDefault();
            updateUser.FirstName = user.FirstName;
            updateUser.LastName = user.LastName;
            updateUser.Email = user.Email;

            await Context.SaveChangesAsync();
        }
    }
}
