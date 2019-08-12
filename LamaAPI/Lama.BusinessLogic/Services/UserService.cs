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
using AutoMapper;
using Lama.Domain.BlobModels;

namespace Lama.BusinessLogic.Services
{
    public class UserService : BaseService<User>
    {
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public UserService(ApplicationDbContext dbContext, IPhotoService photoService, IMapper mapper)
            :base(dbContext)
        {
            _photoService = photoService;
            _mapper = mapper;
        }

        public async Task<int> Create(UserDTO item)
        {
            await Context.Users.AddAsync(_mapper.Map<User>(item));
            await Context.SaveChangesAsync();
            var user = Context.Users.FirstOrDefault(u => u.Email == item.Email);
            item.Photo.AuthorId = user.Id;
            var avatar = await _photoService.CreateAvatar(item.Photo);
            user.AvatarId = avatar.Id;
            Context.Users.Update(user);
            await Context.SaveChangesAsync();
            return (await Context.Users.FirstOrDefaultAsync(u => u.Id == user.Id)).Id;
        }

        public async Task<int> UpdateUser(UserDTO user)
        {
            var newUser = await Context.Users.FirstOrDefaultAsync(u => u.Id== user.Id);
            if (user.Photo.ImageUrl != null)
            {
                var newAvatar = await _photoService.CreateAvatar(user.Photo);
                newUser.AvatarId = newAvatar.Id;
            }
            newUser.FirstName = user.FirstName;
            newUser.LastName = user.LastName;
            newUser.Email = user.Email;
            Context.Users.Update(newUser);
            await Context.SaveChangesAsync();
            return newUser.Id;
        }

        public async Task<UserDTO> GetByEmail(string email)
        {
            var user = (await Context.Users.FirstOrDefaultAsync(u => u.Email == email));
            return _mapper.Map<UserDTO>(user);
        }

        public async Task<UserDTO> Get(int id)
        {
            var u = await Context.Users.SingleAsync(user => user.Id == id);
            var avatar = await Context.Photos.FirstOrDefaultAsync(p => p.Id == u.AvatarId);
            var url = (await _photoService.Get(avatar.ElasticId)).Blob256Id;
            var dto = _mapper.Map<UserDTO>(u);
            dto.PhotoUrl = url;
            return dto;
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


