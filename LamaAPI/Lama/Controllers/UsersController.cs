using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Lama.Domain.DbModels;
using Lama.BusinessLogic.Interfaces;
using Lama.BusinessLogic.Services;
using Microsoft.AspNetCore.Http;
using Lama.Domain.DTO.User;

namespace Lama.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        UserService _service;
        public UsersController(UserService service)
        {
            _service = service;
        }
        [HttpPost]
        public async Task<int> RegisterUser([FromBody] UserDTO user)
        {
            var isExists = await _service.GetByEmail(user.Email);

            if (isExists != null)
            {
                return isExists.Id;
            }
            else
            {
                return await _service.Create(user);
            }
        }

        [HttpGet]
        public async Task Get()
        {
           
        }

        [HttpGet("{id}")]
        public async Task<User> Get(int id)
        {
            return await _service.Get(id);
        }

        //[HttpPost]
        //public async Task Post([FromBody] User value)
        //{
            
        //}

        [HttpPut]
        public async Task Put([FromBody] User value)
        {
            await _service.Update(value);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {

        }
    }
}
