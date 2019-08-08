using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Lama.BusinessLogic.Services;
using Lama.Domain.BlobModels;

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
        public async Task ReceivePhoto([FromBody] PhotoReceived[] photos)
        {
            var response = await _service.CreateAll(photos);
        }
        [HttpGet]
        public async Task<IEnumerable<PhotoDocument>> LoadPhotos()
        {
            return await _service.GetAll();
        }
    }
}