﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Lama.Domain.DTO.Photo;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DTO.Reaction;
using Lama.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Serilog;
using Serilog.Core;

namespace Lama.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class PhotoController : ControllerBase
    {
        private readonly IPhotoService _service;
        private readonly IUserProtectionService _userProtectionService;

        public PhotoController(IPhotoService photoService, IUserProtectionService userProtectionService)
        {
            _service = photoService;
            _userProtectionService = userProtectionService;
        }

        [HttpPost]
        public Task<IEnumerable<UploadPhotoResultDTO>> UploadPhoto([FromBody] CreatePhotoDTO[] photos)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            photos.ToAsyncEnumerable().ForEach(photo => photo.AuthorId = currentUserId);
			Log.Logger.Error("LamaAPI api/photo UploadPhoto method");
            return _service.CreateAll(photos);
        }

        [HttpPost("duplicates")]
        public Task<IEnumerable<UploadPhotoResultDTO>> UploadDuplicates([FromBody] UploadPhotoResultDTO[] duplicates)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            duplicates.ToAsyncEnumerable().ForEach(photo => photo.UserId = currentUserId);
            return _service.CreateDuplicates(duplicates);
        }

        [HttpGet("duplicates/{id}")]
        public Task<IEnumerable<UploadPhotoResultDTO>> GetDuplicates(int id)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return _service.GetDuplicates(currentUserId);
        }

        [HttpPost("reaction")]
        public async Task PostReaction([FromBody] NewLikeDTO newLike)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            newLike.UserId = currentUserId;
            await _service.AddReaction(newLike);
        }

        [HttpPost("removereaction")]
        public async Task RemoveReaction([FromBody] NewLikeDTO removeLike)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            removeLike.UserId = currentUserId;
            await _service.RemoveReaction(removeLike);
        }

        [HttpGet("search/{id}/{criteria}")]
        public Task<IEnumerable<PhotoDocumentDTO>> FindPhotos(int id, string criteria)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return _service.FindPhoto(currentUserId, criteria);
        }

        [HttpGet("search_history/{id}")]
        public Task<IEnumerable<string>> GetHistory(int id)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return _service.GetHistory(currentUserId);
        }

        [HttpGet("search/fields/{id}/{criteria}")]
        public Task<Dictionary<string, List<string>>> FindFields(int id, string criteria)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return _service.FindFields(currentUserId, criteria);
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

        [HttpGet("{id}")]
        public async Task<PhotoDocumentDTO> GetPhoto(int id)
        {
            return await _service.Get(id);
        }

        [HttpGet("user/{id}")]
        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserPhotos(int id)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return await _service.GetUserPhotos(currentUserId);
        }

        [HttpGet("categorized")]
        public async Task<IEnumerable<PhotoCategoryDTO>> GetUserPhotosCategorized()
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return await _service.GetUserPhotosCategorized(currentUserId);
        } 
        [HttpGet("categorized/{value}")]
        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserCategory(string value)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return await _service.GetUserCategory(value,currentUserId);
        }
        [AllowAnonymous]
        [HttpPost("duplicates_response")]
        public async Task SendDuplicates(IEnumerable<int> photos)
        {
            await _service.SendDuplicates(photos);
        }

        [AllowAnonymous]
        [HttpPost("photoCategory")]
        public async Task SetPhotoCategory([FromBody]string photoData)
        {
            await _service.SetPhotoCategory(photoData);
        }

        [AllowAnonymous]
        [HttpGet("images/{blobId}")]
        public async Task<string> GetPhoto(string blobId)
        {
            return await _service.GetPhoto(blobId);
        }

        [HttpGet("similar/{id}")]
        public async Task<IEnumerable<PhotoDocumentDTO>> GetSimilarPhotos(int id)
        {
            return await _service.GetSimilarPhotos(id);
        }

        [AllowAnonymous]
        [HttpGet("avatars/{blobId}")]
        public async Task<string> GetAvatar(string blobId)
        {
            return await _service.GetAvatar(blobId);
        }

        [HttpGet("rangeUserPhotos")]
        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserPhotosRange([FromHeader] int id, [FromHeader] int startId, [FromHeader] int count)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return await _service.GetUserPhotosRange(currentUserId, startId, count);
        }

        [HttpDelete("{photoToDeleteId}")]
        public Task MarkPhotoAsDeleted(int photoToDeleteId)
        {
            return _service.MarkPhotoAsDeleted(photoToDeleteId);
        }

        [HttpGet]
        [Route("deleted/{userId}")]
        public Task<DeletedPhotoDTO[]> GetDeletedPhotos(int userId)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return _service.GetDeletedPhotos(currentUserId);
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
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return _service.RestoresDeletedPhotos(currentUserId,photosToRestore);
        } 
    }
}