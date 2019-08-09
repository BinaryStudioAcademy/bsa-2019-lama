﻿using System;
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
        public async Task Get()
        {
           
        }

        [HttpGet("{id}")]
        public async Task<User> Get(int id)
        {
            return await service.Get(id);
        }

        [HttpPost]
        public async Task Post([FromBody] User value)
        {
        }

        [HttpPut]
        public async Task Put([FromBody] User value)
        {
            service.Update(value);
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
        }
    }
}
