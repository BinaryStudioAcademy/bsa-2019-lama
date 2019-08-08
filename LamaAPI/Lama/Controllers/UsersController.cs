using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lama.BusinessLogic.Services;
using Lama.Domain.DbModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<int> RegisterUser([FromBody] User user)
        {
            var isExists = _service.GetByEmail(user.Email);

            if (isExists != null)
            {
                return isExists.Id;
            }
            else
            {
                return await _service.CreateWithFeedback(user);
            }
        }
    }
}