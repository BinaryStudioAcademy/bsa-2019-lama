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
using Lama.Domain.DTO.User;

namespace Lama.BusinessLogic.Services
{
    public class UserService : BaseService<User>
    {
        private readonly PhotoService _photoService;
        public UserService(ApplicationDbContext dbContext, PhotoService photoService)
            :base(dbContext)
        {
            _photoService = photoService;
        }

        public async Task<int> Create(UserDTO item)
        {
            await Context.Users.AddAsync(new User
            {
                FirstName = item.FirstName,
                LastName = item.LastName,
                Email = item.Email,
            });
            await Context.SaveChangesAsync();
            var user = Context.Users.FirstOrDefault(u => u.Email == item.Email);
            item.Photo.AuthorId = user.Id;
            var avatar = await _photoService.CreateAvatar(item.Photo);
            user.AvatarId = avatar.Id;
            Context.Users.Update(user);
            await Context.SaveChangesAsync();
            return (await Context.Users.FirstOrDefaultAsync(u => u.Id == user.Id)).Id;
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


