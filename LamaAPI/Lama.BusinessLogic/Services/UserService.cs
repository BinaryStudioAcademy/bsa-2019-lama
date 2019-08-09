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
            var updateUser = Context.Users.FirstOrDefault(u => u.Id == user.Id);

            if (updateUser == null)
            {
                throw new NotFoundException(nameof(User), user.Id);
            }
            

            updateUser.FirstName = user.FirstName;
            updateUser.LastName = user.LastName;
            updateUser.Email = user.Email;

            await Context.SaveChangesAsync();
        }
    }
}
