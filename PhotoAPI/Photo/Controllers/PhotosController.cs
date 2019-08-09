using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using Photo.BusinessLogic.Interfaces;

using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;

namespace Photo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotosController : ControllerBase
    {
        // FIELDS
        IPhotoService photoService;

        // CONSTRUCTORS
        public PhotosController(IPhotoService photoService)
        {
            this.photoService = photoService;
        }

        // ACTIONS
        // GET api/photos
        [HttpGet]
        public async Task<IEnumerable<PhotoDocument>> Get()
        {
            return await photoService.Get();
        }

        // GET api/photos/5
        [HttpGet("{id}")]
        public Task<PhotoDocument> Get(int id)
        {
            return photoService.Get(id);
        }

        // POST api/values
        [HttpPost]
        public async Task Post([FromBody] PhotoReceived[] values)
        {
            await this.photoService.Create(values);
        }

        // PUT api/photos/
        [HttpPut]
        public Task<UpdatedPhotoResultDTO> Put([FromBody] UpdatePhotoDTO value)
        {
            return this.photoService.UpdateImage(value);
        }

        // DELETE api/photos/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            this.photoService.Delete(id);
        }
    }
}
