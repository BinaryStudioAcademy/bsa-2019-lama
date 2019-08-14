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
        public async Task CreateAlbumWithNewPhotos([FromBody] NewAlbum album)
        {
            await _service.CreateAlbumWithNewPhotos(album);
        }
        [HttpPost("CreateWithExistPhoto")]
        public async Task CreateAlbumWithExistPhotos([FromBody] AlbumWithExistPhotos album)
        {
            await _service.CreateAlbumWithExistPhotos(album);
        }
        [HttpPost("ArchivePhotos")]
        public async Task<List<Byte[]>> GetPhotos([FromBody] PhotoDocument[] photoDocuments)
        {
            return await _service.GetPhotos(photoDocuments);
        }
        [HttpPut]
        public async Task UpdateAlbum([FromBody] Album album)
        {

        }
        [HttpDelete("{id}")]
        public async Task<int> DeleteAlbum(int id)
        {
            return await _service.RemoveAlbum(id);
        }
        
        [HttpGet("{id}")]
        public async Task<List<ReturnAlbum>> GetUserAlbums(int id)
        {
            return await _service.FindAll(id);
        }

        [HttpGet("album/{id}")]
        public async Task<ReturnAlbum> GetAlbum(int id)
        {
            return await _service.FindAlbum(id);
        }

        [HttpGet]
        public async Task<string> GetAlbums()
        {
            return null;
        }
    }
}