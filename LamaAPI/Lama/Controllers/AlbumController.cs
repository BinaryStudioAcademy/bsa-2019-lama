using System.Collections.Generic;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.BlobModels;
using Lama.Domain.DTO.Album;
using Lama.Domain.DTO.Photo;
using Lama.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumService _service;
        private readonly IUserProtectionService _userProtectionService;

        public AlbumController(IAlbumService albumService, IUserProtectionService userProtectionService)
        {
            _service = albumService;
            _userProtectionService = userProtectionService;
        }

        [HttpPost("CreateWithNewPhoto")]
        public async Task<ReturnAlbumDTO> CreateAlbumWithNewPhotos([FromBody] NewAlbumDTO albumDto)
        {
            var currentUserEmail = this.GetUserEmail();
            var userId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            albumDto.AuthorId = userId;
            return await _service.CreateAlbumWithNewPhotos(albumDto);
        }
        [HttpPost("CreateWithExistPhoto")]
        public async Task<ReturnAlbumDTO> CreateAlbumWithExistPhotos([FromBody] AlbumWithExistPhotosDTO album)
        {
            var currentUserEmail = this.GetUserEmail();
            var userId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            album.AuthorId = userId;
            return await _service.CreateAlbumWithExistPhotos(album);
        }
        [HttpPost("CreateEmptyAlbum")]
        public async Task<ReturnAlbumDTO> CreateEmptyAlbum([FromBody] NewAlbumDTO album)
        {
            var currentUserEmail = this.GetUserEmail();
            var userId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            album.AuthorId = userId;
            var createdAlbumId = await _service.CreateEmptyAlbum(album);
            return await _service.FindAlbum(createdAlbumId);
        }

        [AllowAnonymous]
        [HttpPost("ArchivePhotos")]
        public async Task<List<byte[]>> GetPhotos([FromBody] List<string> photoDocuments)
        {
            return await _service.GetPhotos(photoDocuments);
        }

        [HttpPost("AlbumNewPhotos")]
        public async Task<List<PhotoDocumentDTO>> AddNewPhotosToAlbum([FromBody] NewPhotosAlbum newPhotosAlbum)
        {
            var currentUserEmail = this.GetUserEmail();
            var userId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            newPhotosAlbum.UserId = userId;
            return await _service.AddNewPhotosToAlbum(newPhotosAlbum);
        }
        [HttpPost("AlbumExistPhotos")]
        public async Task<List<PhotoDocumentDTO>> AddExistPhotosToAlbum([FromBody] ExistPhotosAlbum existPhotosAlbum)
        {
            return await _service.AddExistPhotosToAlbum(existPhotosAlbum);
        }
        [HttpPut]
        public async Task UpdateAlbum([FromBody] UpdateAlbumDTO album)
        {
            await _service.UpdateAlbum(album);
        }

        [HttpPut("title")]
        public async Task<int> UpdateAlbumTitle([FromBody] UpdateAlbumDTO album)
        {
            return await _service.UpdateAlbumTitle(album);
        }

        [HttpPut("updateCover")]
        public async Task<int?> UpdateAlbumCover([FromBody] UpdateAlbumDTO album)
        {
            return await _service.UpdateCover(album);
        }
        
        [HttpDelete("{id}")]
        public async Task<int> DeleteAlbum(int id)
        {
            return await _service.RemoveAlbum(id);
        }

        [HttpDelete("cover/{id}")]
        public async Task<int> DeleteAlbumCover(int id)
        {
            return await _service.RemoveAlbumCover(id);
        }

        [HttpDelete("photos/{albumId}")]
        public async Task<int> DeletePhotosFromAlbum(int albumId, [FromBody]int[] photos)
        {
            return await _service.RemovePhotosFromAlbum(albumId, photos);
        }

        [HttpGet("details/{id}")]
        public async Task<List<AlbumPhotoDetails>> GetAlbumsPhotoDetails(int id)
        {
            return await _service.GetAlbumPhotoDetails(id);
        }
        [HttpGet("{id}")]
        public async Task<List<ReturnAlbumDTO>> GetUserAlbums(int id)
        {
            return await _service.FindAll(id);
        }

        [HttpGet("album/{id}")]
        public async Task<ReturnAlbumDTO> GetAlbum(int id)
        {
            return await _service.FindAlbum(id);
        }
        
    }
}