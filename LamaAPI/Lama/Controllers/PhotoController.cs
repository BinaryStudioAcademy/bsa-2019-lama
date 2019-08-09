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
        private readonly ReceiveService _receiver;

        public PhotoController(PhotoService photoService, ReceiveService receiver)
        {
            _service = photoService;
            _receiver = receiver;

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

        [HttpPost("saveElasticId")]
        public async Task ReceiveElasticId([FromBody] int id)
        {
            await _receiver.Post(id);
        }
    }
}