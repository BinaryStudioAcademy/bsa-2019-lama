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
using Lama.Domain.BlobModels;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Lama.Infrastructure;
using Microsoft.AspNetCore.Authorization;

namespace Lama.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        readonly UserService _service;
        public UsersController(UserService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<int> RegisterUser([FromBody] UserDTO user)
        {
            var userDTO = await _service.GetByEmail(user.Email);
            var userId = userDTO?.Id ?? await _service.Create(user);
            

            return userId;
        }

        [HttpPut]
        public async Task<int> UpdateUser([FromBody] UserDTO user)
        {
             return await _service.UpdateUser(user);
        }


        [HttpGet("{id}")]
        public async Task<UserDTO> Get(int id)
        {
            return await _service.Get(id);
        }
		
        [HttpGet("email/{email}")]
        public async Task<UserDTO> GetByEmail(string email)
        {
            return await _service.GetByEmail(email);
        }
        
    }
}
