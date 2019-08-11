using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.BusinessLogic.Services;
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
        public async Task CreateAlbumWithExistPhotos([FromBody] NewAlbum album)
        {
            await _service.CreateAlbumWithExistPhotos(album);
        }
        [HttpPut]
        public async Task UpdateAlbum([FromBody] Album album)
        {

        }
        [HttpDelete]
        public async Task DeleteAlbum([FromBody] int id)
        {

        }
        [HttpGet("{id}")]
        public async Task GetAlbum(int id)
        {

        }
        [HttpGet]
        public async Task GetAlbums()
        {

        }
    }
}