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
using Lama.DataAccess;
using Lama.BusinessLogic.Exceptions;

namespace Lama.BusinessLogic.Services
{
    public class UserService : BaseService<User>
    {
        public UserService(ApplicationDbContext dbContext)
            :base(dbContext)
        {

        }

        public override async Task<int> Create(User item)
        {
            await Context.Users.AddAsync(item);
            await Context.SaveChangesAsync();
            return (await Context.Users.FirstOrDefaultAsync(u => u.Id == item.Id)).Id;
        }

        public async Task<User> GetByEmail(string email)
        {
            return (await Context.Users.FirstOrDefaultAsync(u => u.Email == email));
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


