using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Lama.Domain.DTO.Photo;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DTO.Reaction;
using Microsoft.AspNetCore.Authorization;

namespace Lama.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private readonly IPhotoService _service;

        public PhotoController(IPhotoService photoService)
        {
            _service = photoService;
        }

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

        [HttpGet("search/{id}/{criteria}")]
        public Task<IEnumerable<PhotoDocumentDTO>> FindPhotos(int id, string criteria)
        {
            return _service.FindPhoto(id, criteria);
        }

        [HttpGet("search_history/{id}")]
        public Task<IEnumerable<string>> GetHistory(int id)
        {
            return _service.GetHistory(id);
        }

        [HttpGet("search/fields/{id}/{criteria}")]
        public Task<Dictionary<string, List<string>>> FindFields(int id, string criteria)
        {
            return _service.FindFields(id, criteria);
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

        [HttpGet("avatars/{blobId}")]
        public async Task<string> GetAvatar(string blobId)
        {
            return await _service.GetAvatar(blobId);
        }


        #region DELETE
        [HttpDelete("{photoToDeleteId}")]
        public Task MarkPhotoAsDeleted(int photoToDeleteId)
        {
            return _service.MarkPhotoAsDeleted(photoToDeleteId);
        }

        [HttpGet]
        [Route("deleted/{userId}")]
        public Task<DeletedPhotoDTO[]> GetDeletedPhotos(int userId)
        {
            return _service.GetDeletedPhotos(userId);
        }

        [HttpPost]
        [Route("delete_permanently")]
        public Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            return _service.DeletePhotosPermanently(photosToDelete);
        }

        [HttpPost]
        [Route("restore")]
        public Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            return _service.RestoresDeletedPhotos(photosToRestore);
        }        
        #endregion
    }
}