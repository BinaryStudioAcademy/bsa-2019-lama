using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Lama.BusinessLogic.Services;

namespace Lama.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private readonly PhotoService _service;

        public PhotoController(PhotoService photoService)
        {
            _service = photoService;

        }
        [HttpPost]
        public async Task ReceivePhoto([FromBody] string[] photos)
        {
            var response = await _service.SendPhotoToApi(photos);
        }
    }
}