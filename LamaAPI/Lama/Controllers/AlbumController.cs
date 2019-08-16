using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.BusinessLogic.Services;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Album;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlbumController : ControllerBase
    {
        private readonly IAlbumService _service;

        public AlbumController(IAlbumService AlbumService)
        {
            _service = AlbumService;
        }

        [HttpPost("CreateWithNewPhoto")]
        public async Task<ReturnAlbumDTO> CreateAlbumWithNewPhotos([FromBody] NewAlbumDTO albumDto)
        {
            int createdAlbumId = await _service.CreateAlbumWithNewPhotos(albumDto);
            return await _service.FindAlbum(createdAlbumId);
        }
        [HttpPost("CreateWithExistPhoto")]
        public async Task<ReturnAlbumDTO> CreateAlbumWithExistPhotos([FromBody] AlbumWithExistPhotosDTO album)
        {
            int createdAlbumId = await _service.CreateAlbumWithExistPhotos(album);
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
        [HttpDelete("{id}")]
        public async Task<int> DeleteAlbum(int id)
        {
            return await _service.RemoveAlbum(id);
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