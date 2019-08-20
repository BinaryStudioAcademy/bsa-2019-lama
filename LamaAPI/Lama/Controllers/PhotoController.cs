using System.Collections.Generic;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;

using Lama.Domain.BlobModels;
using Lama.Domain.DTO.Photo;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DTO.Reaction;

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
        #region CREATE
        [HttpPost]
        public Task<IEnumerable<UploadPhotoResultDTO>> ReceivePhoto([FromBody] CreatePhotoDTO[] photos)
        {
            return _service.CreateAll(photos);
        }

        [HttpPost("reaction")]
        public async Task PostReaction([FromBody] NewLikeDTO newLike)
        {
            await _service.AddReaction(newLike);
        }

        [HttpPost("removereaction")]
        public async Task RemoveReaction([FromBody] NewLikeDTO removeLike)
        {
            await _service.RemoveReaction(removeLike);
        }
        #endregion

        [HttpGet("search/{criteria}")]
        public Task<IEnumerable<PhotoDocumentDTO>> FindPhotos(string criteria)
        {
            return _service.FindPhoto(criteria);
        }

        [HttpPut]
        public Task<UpdatedPhotoResultDTO> UpdatePhoto([FromBody] UpdatePhotoDTO photoToUpdate)
        {
            return _service.UpdatePhoto(photoToUpdate);
        }

        [HttpGet]
        public async Task<IEnumerable<PhotoDocumentDTO>> LoadPhotos()
        {
            return await _service.GetAll();
        }

        [HttpGet("user/{id}")]
        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserPhotos(int id)
        {
            return await _service.GetUserPhotos(id);
        }
        [HttpGet("images/{blobId}")]
        public async Task<string> GetPhoto(string blobId)
        {
            return await _service.GetPhoto(blobId);
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