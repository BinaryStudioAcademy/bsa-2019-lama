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
        public async Task<IEnumerable<int>> Post([FromBody] PhotoReceived[] values)
        {
            return await this.photoService.Create(values);
        }

        //[HttpPost]
        //public async Task<int> Post([FromBody] PhotoReceived value)
        //{
        //    return await this.photoService.Create(value);
        //}

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
        
        // PUT api/photos/
        // TODO: set up for working with elastic
        // TODO: check if this work
        [HttpPut("/shared/{id}")]
        public async Task<ActionResult<PhotoDocument>> UpdateWithSharedLink(int id, [FromBody] string sharedLink)
        {
            return Ok(await photoService.UpdateWithSharedLink(id, sharedLink));
        }

        // PUT api/photos/
        [HttpPut]
        public Task<UpdatedPhotoResultDTO> Put([FromBody] UpdatePhotoDTO value)
        {
            return this.photoService.UpdateImage(value);
        }


        #region DELETE
        // DELETE: api/photos/5
        [HttpDelete("{photoToDeleteId}")]
        public Task MarkPhotoAsDeleted(int photoToDeleteId)
        {
            return this.photoService.MarkPhotoAsDeleted(photoToDeleteId);
        }

        // GET: api/photos/deleted
        [HttpGet]
        [Route("deleted")]
        public Task<DeletedPhotoDTO[]> GetDeletedPhotos()
        {

            return this.photoService.GetDeletedPhotos();
        }

        // POST: api/photos/delete_permanently
        [HttpPost]
        [Route("delete_permanently")]
        public Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            return this.photoService.DeletePhotosPermanently(photosToDelete);
        }

        // POST: api/photos/restore
        [HttpPost]
        [Route("restore")]
        public Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            return this.photoService.RestoresDeletedPhotos(photosToRestore);
        }
        #endregion
    }
}
