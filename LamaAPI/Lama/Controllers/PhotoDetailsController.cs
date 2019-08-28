﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DTO.PhotoDetails;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoDetailsController : ControllerBase
    {
        private readonly IPhotoDetailsService _service;

        public PhotoDetailsController(IPhotoDetailsService _service)
        {
            this._service = _service;
        }
        [HttpPost("description")]
        public async Task<string> UpdateDescription([FromBody] NewDescription newDescription)
        {
            return await _service.UpdateDescription(newDescription);
        }
        [HttpPut("location")]
        public async Task<string> UpdateLocation([FromBody] NewLocation newLocation)
        {
            return await _service.UpdateLocation(newLocation);
        }

        [HttpDelete("location/{Id}")]
        public async Task DeleteLocation(int Id)
        {
           await _service.DeleteLocation(Id);
        }
    }
}