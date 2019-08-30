using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DTO.PhotoDetails;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoDetailsController : ControllerBase
    {
        private readonly IPhotoDetailsService _service;
        private readonly IUserProtectionService _userProtectionService;

        public PhotoDetailsController(IPhotoDetailsService service, IUserProtectionService userProtectionService)
        {
            _service = service;
            _userProtectionService = userProtectionService;
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

        [HttpPut("date")]
        public async Task<DateTime> UpdatePhotoDate([FromBody] NewDatePhoto time)
        {
            return await _service.UpdatePhotoDate(time);
        }
    }
}