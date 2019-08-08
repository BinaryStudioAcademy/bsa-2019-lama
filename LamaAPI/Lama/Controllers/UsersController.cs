using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Lama.Domain.DbModels;
using Lama.BusinessLogic.Interfaces;
using Lama.BusinessLogic.Services;
using Microsoft.AspNetCore.Http;

namespace Lama.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private UserService service;
        
        public UsersController(BaseService<User> service)
        {
            this.service = service as UserService;
        }

        [HttpGet]
        public Task<string> Get()
        {
            throw new NotImplementedException();
        }

        [HttpGet("{id}")]
        public async Task<User> Get(string id)
        {
            return await service.Get(id);
        }

        [HttpPost]
        public void Post([FromBody] User value)
        {
        }

        [HttpPut]
        public void Put([FromBody] User value)
        {
            service.Update(value);
        }

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
