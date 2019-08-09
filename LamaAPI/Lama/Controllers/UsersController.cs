using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Lama.Domain.DbModels;
using Lama.BusinessLogic.Interfaces;
using Lama.BusinessLogic.Services;
using Microsoft.AspNetCore.Http;
using Lama.Domain.DTO;
using AutoMapper;
using Lama.Domain.BlobModels;

namespace Lama.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        UserService _service;
        PhotoService _photoService;
        IMapper _mapper;
        public UsersController(UserService service, IMapper mapper, PhotoService photoService)
        {
            _service = service;
            _mapper = mapper;
            _photoService = photoService;
        }
        [HttpPost]
        public async Task<int> RegisterUser([FromBody] UserCreate user)
        {
            var isExists = await _service.GetByEmail(user.Email);

            if (isExists != null)
            {
                return isExists.Id;
            }
            else
            {
                var photo = new PhotoReceived[] { user.Avatar };
                await _photoService.CreateAll(photo);
                var photoId = (await _photoService.GetAll()).LastOrDefault().Id;
                return await _service.CreateWithFeedback(new User {
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    AvatarId = photoId
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<UserDTO> Get(int id)
        {
            User user = await _service.Get(id);
            return _mapper.Map<UserDTO>(user);
        }

        [HttpPost("create")]
        public void Post([FromBody] User value)
        {
            
        }

        [HttpPut]
        public async Task Put([FromBody] User value)
        {
            await _service.Update(value);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {

        }
    }
}
