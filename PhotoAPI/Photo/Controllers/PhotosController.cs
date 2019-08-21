using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
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
        IMessageService messageService;

        // CONSTRUCTORS
        public PhotosController(IPhotoService photoService, IMessageService messageService)
        {
            this.photoService = photoService;
            this.messageService = messageService;
        }

        // ACTIONS
        // GET api/photos
        [HttpGet]
        public async Task<IEnumerable<PhotoDocument>> Get()
        {
            return await photoService.Get();
        }
        [HttpGet("images/{blobId}")]
        public async Task<string> GetPhoto(string blobId)
        {
            return await photoService.GetPhoto(blobId);
        }

        // GET api/photos/5
        [HttpGet("user/{id}")]
        public async Task<IEnumerable<PhotoDocument>> GetUserPhotos(int id)
        {
            return await photoService.GetUserPhotos(id);
        }

        // GET api/photos/5
        [HttpGet("{id}")]
        public Task<PhotoDocument> Get(int id)
        {
            return photoService.Get(id);
        }

        [HttpGet("search/{criteria}")]
        public Task<IEnumerable<PhotoDocument>> Find(string criteria)
        {
            return photoService.Find(criteria);
        }

        // POST api/values
        [HttpPost]
        public async Task<IEnumerable<CreatePhotoResultDTO>> Post([FromBody] CreatePhotoDTO[] values)
        {
            return await this.photoService.Create(values);
        }

        [HttpPost("ArchivePhotos")]
        public async Task<List<Byte[]>> GetPhotos([FromBody] PhotoDocument[] values)
        {
            return await this.photoService.GetPhotos(values);
        }
        [HttpPost("avatar")]
        public async Task<int> PostAvatar([FromBody] CreatePhotoDTO value)
        {
            return await this.photoService.CreateAvatar(value);
        }

        //[HttpPost]
        //public async Task<int> Post([FromBody] PhotoReceived value)
        //{
        //    return await this.photoService.Create(value);
        //}


        //TODO: set up for working with elastic
        /*        [HttpPut("/shared/{id}")]
                public async Task<ActionResult<PhotoDocument>> UpdateWithSharedLink(int id, [FromBody] string sharedLink)
                {
                    return Ok(await photoService.UpdateWithSharedLink(id, sharedLink));
                }*/

        // PUT api/photos/shared/1
        // TODO: set up for working with elastic
        // TODO: check if this work
        [HttpPut("shared/{id}")]
        public async Task<PhotoDocument> UpdateWithSharedLink(int id)
        {
            using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                var sharedLink = await reader.ReadToEndAsync();
                
                return await photoService.UpdateWithSharedLink(id, sharedLink);
            }
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
        [Route("deleted/{userId}")]
        public Task<DeletedPhotoDTO[]> GetDeletedPhotos(int userId)
        {

            return this.photoService.GetDeletedPhotos(userId);
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
