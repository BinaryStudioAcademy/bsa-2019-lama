using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using Photo.BusinessLogic.Interfaces;

using Photo.Domain.BlobModels;

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
        //[HttpPost]
        //public async Task Post([FromBody] PhotoReceived[] values)
        //{
        //    await this.photoService.Create(values);
        //}

        [HttpPost]
        public async Task<int> Post([FromBody] PhotoReceived value)
        {
            return await this.photoService.Create(value);
        }

        [HttpPost("avatar")]
        public async Task<int> PostAvatar([FromBody] PhotoReceived value)
        {
            return await this.photoService.CreateAvatar(value);
        }

        //TODO: set up for working with elastic
        /*        [HttpPut("/shared/{id}")]
                public async Task<ActionResult<PhotoDocument>> UpdateWithSharedLink(int id, [FromBody] string sharedLink)
                {
                    return Ok(await photoService.UpdateWithSharedLink(id, sharedLink));
                }*/

        // PUT api/photos/5
        [HttpPut]
        public void Put([FromBody] PhotoDocument value)
        {
            this.photoService.Update(value);
        }

        // DELETE api/photos/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            this.photoService.Delete(id);
        }
    }
}
