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

        /*
        [HttpGet]
        [Route("current")]
        public async Task<GetUserDTO> GetCurrentUser()
        {
            int loggedUserId = this.GetClaim<int>("UserId");

            return await _service.GetUser(loggedUserId);
        }
        */
        [HttpPost]
        public async Task<int> RegisterUser([FromBody] UserDTO user)
        {
            UserDTO userDTO = await _service.GetByEmail(user.Email);
            int userId = userDTO != null ? userDTO.Id.Value : await _service.Create(user);

            //await AuthenticateAsync(userId);

            return userId;
        }
        /*
        [HttpGet]
        [Route("logout")]
        public Task Logout()
        {
            return HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        [NonAction]
        private async Task AuthenticateAsync(int userId)
        {
            Claim[] claims = new Claim[]
            {
                new Claim("UserId", userId.ToString()),
            };

            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }
        */
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
