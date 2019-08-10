﻿using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using Lama.Domain.BlobModels;
using Lama.Domain.DataTransferObjects.Photo;
using Lama.BusinessLogic.Interfaces;

namespace Lama.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        // FIELDS
        private readonly IPhotoService _service;

        // CONSTRUCTORS
        public PhotoController(IPhotoService photoService)
        {
            _service = photoService;

        }

        // METHODS
        [HttpPost]
        public async Task ReceivePhoto([FromBody] PhotoReceived[] photos)
        {
            var response = await _service.CreateAll(photos);
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

        #region DELETE
        // DELETE: api/photo/5
        [HttpDelete("{photoToDeleteId}")]
        public Task MarkPhotoAsDeleted(int photoToDeleteId)
        {
            return _service.MarkPhotoAsDeleted(photoToDeleteId);
        }

        // GET: api/photo/deleted
        [HttpGet]
        [Route("deleted")]
        public Task<DeletedPhotoDTO[]> GetDeletedPhotos()
        {
            return _service.GetDeletedPhotos();
        }

        // POST: api/photo/delete_permanently
        [HttpPost]
        [Route("delete_permanently")]
        public Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            return _service.DeletePhotosPermanently(photosToDelete);
        }

        // POST: api/photo/restore
        [HttpPost]
        [Route("restore")]
        public Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            return _service.RestoresDeletedPhotos(photosToRestore);
        }        
        #endregion
    }
}