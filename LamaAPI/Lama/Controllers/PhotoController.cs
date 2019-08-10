using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using Lama.BusinessLogic.Services;
using Lama.Domain.BlobModels;
using Lama.Domain.DataTransferObjects.Photo;

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
            await _service.CreateAll(photos);
        }

        [HttpPut]
        public Task<UpdatedPhotoResultDTO> UpdatePhoto([FromBody] UpdatePhotoDTO photoToUpdate)
        {
            return _service.UpdatePhoto(photoToUpdate);
        }
        [HttpGet]
        public async Task<IEnumerable<PhotoDocument>> LoadPhotos()
        {
            return await _service.GetAll();
        }
    }
}