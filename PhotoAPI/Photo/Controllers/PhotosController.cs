using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Nest;
using Photo.BusinessLogic.Interfaces;

using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;
using Serilog;

namespace Photo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotosController : ControllerBase
    {
        private readonly IPhotoService _photoService;

        public PhotosController(IPhotoService photoService)
        {
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<IEnumerable<PhotoDocument>> Get()
        {
            return await _photoService.Get();
        }
        
        [HttpGet("images/{blobId}")]
        public async Task<string> GetPhoto(string blobId)
        {
            return await _photoService.GetPhoto(blobId);
        }

        [HttpGet("avatars/{blobId}")]
        public async Task<string> GetAvatar(string blobId)
        {
            return await _photoService.GetAvatar(blobId);
        }

        // GET api/photos/5
        [HttpGet("user/{id}")]
        public async Task<IEnumerable<PhotoDocument>> GetUserPhotos(int id)
        {
            return await _photoService.GetUserPhotos(id);
        }

        // GET api/photos/5
        [HttpGet("{id}")]
        public Task<PhotoDocument> Get(int id)
        {
            return _photoService.Get(id);
        }
        [HttpPost("checkuser")]
        public async Task<int> CheckUserPhoto([FromBody] Tuple<int,int> s)
        {
           return await _photoService.CheckAuthorPhoto(s);
        }
        [HttpGet("search/{id}/{criteria}")]
        public async Task<IEnumerable<PhotoDocument>> Find(int id, string criteria)
        {
            return await _photoService.Find(id, criteria);
        }

        [HttpGet("search/fields/{id}/{criteria}")]
        public async Task<Dictionary<string, List<string>>> FindFields(int id, string criteria)
        {
            return await _photoService.FindFields(id, criteria);
        }

        [HttpGet("rangeUserPhotos")]
        public async Task<IEnumerable<PhotoDocument>> GetUserPhotosRange([FromHeader] int userId, [FromHeader] int startId, [FromHeader] int count)
        {
            return await _photoService.GetUserPhotosRange(userId, startId, count);
        }
        
        [HttpPost]
        public async Task<IEnumerable<CreatePhotoResultDTO>> Post([FromBody] CreatePhotoDTO[] values)
        {
            return await _photoService.Create(values);
        }

        [HttpPost("duplicates")]
        public async Task<IEnumerable<CreatePhotoResultDTO>> Post([FromBody] CreatePhotoResultDTO[] duplicates)
        {
            return await _photoService.CreateDuplicates(duplicates);
        }

        [HttpGet("duplicates/{id}")]
        public async Task<IEnumerable<IEnumerable<CreatePhotoResultDTO>>> GetDuplicates(int id)
        {
            return await _photoService.FindDuplicates(id);
        }

        [HttpGet("similar/{id}")]
        public async Task<IEnumerable<PhotoDocumentDTO>> GetSimilarPhotos(int id)
        {
            return await _photoService.FindSimilarPhotos(id);
        }

        [HttpPost("ArchivePhotos")]
        public async Task<List<byte[]>> GetPhotos([FromBody] List<string> values)
        {
            return await _photoService.GetPhotos(values);
        }
        [HttpPost("avatar")]
        public async Task<string> PostAvatar([FromBody] CreatePhotoDTO value)
        {
            return await _photoService.CreateAvatar(value);
        }
        
        [HttpPut("shared/{id}")]
        public async Task<PhotoDocument> UpdateWithSharedLink(int id)
        {
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                var sharedLink = await reader.ReadToEndAsync();
                
                return await _photoService.UpdateWithSharedLink(id, sharedLink);
            }
        }

        // PUT api/photos/
        [HttpPut]
        public Task<UpdatedPhotoResultDTO> Put([FromBody] UpdatePhotoDTO value)
        {
            return _photoService.UpdateImage(value);
        }
        [HttpPut("document")]
        public async Task UpdateDocument([FromBody] PhotoDocument document)
        {
            await _photoService.Update(document);
        }
        #region DELETE
        // DELETE: api/photos/5
        [HttpDelete("{photoToDeleteId}")]
        public Task MarkPhotoAsDeleted(int photoToDeleteId)
        {
            return _photoService.MarkPhotoAsDeleted(photoToDeleteId);
        }

        // GET: api/photos/deleted
        [HttpGet]
        [Route("deleted/{userId}")]
        public Task<DeletedPhotoDTO[]> GetDeletedPhotos(int userId)
        {
            return _photoService.GetDeletedPhotos(userId);
        }

        // POST: api/photos/delete_permanently
        [HttpPost]
        [Route("delete_permanently")]
        public Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            return _photoService.DeletePhotosPermanently(photosToDelete);
        }

        // POST: api/photos/restore
        [HttpPost]
        [Route("restore")]
        public Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            return _photoService.RestoresDeletedPhotos(photosToRestore);
        }
        #endregion
    }
}
