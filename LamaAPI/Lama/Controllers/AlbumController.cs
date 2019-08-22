using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.BlobModels;
using Lama.Domain.DTO.Album;
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

        public AlbumController(IAlbumService albumService)
        {
            _service = albumService;
        }

        [HttpPost("CreateWithNewPhoto")]
        public async Task<ReturnAlbumDTO> CreateAlbumWithNewPhotos([FromBody] NewAlbumDTO albumDto)
        {
            var createdAlbumId = await _service.CreateAlbumWithNewPhotos(albumDto);
            return await _service.FindAlbum(createdAlbumId);
        }
        [HttpPost("CreateWithExistPhoto")]
        public async Task<ReturnAlbumDTO> CreateAlbumWithExistPhotos([FromBody] AlbumWithExistPhotosDTO album)
        {
            var createdAlbumId = await _service.CreateAlbumWithExistPhotos(album);
            return await _service.FindAlbum(createdAlbumId);
        }
        [HttpPost("CreateEmptyAlbum")]
        public async Task<ReturnAlbumDTO> CreateEmptyAlbum([FromBody] NewAlbumDTO album)
        {
            var createdAlbumId = await _service.CreateEmptyAlbum(album);
            return await _service.FindAlbum(createdAlbumId);
        }
        [HttpPost("ArchivePhotos")]
        public async Task<List<Byte[]>> GetPhotos([FromBody] PhotoDocument[] photoDocuments)
        {
            return await _service.GetPhotos(photoDocuments);
        }
        [HttpPut]
        public async Task UpdateAlbum([FromBody] UpdateAlbumDTO album)
        {
            await _service.UpdateAlbum(album);
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