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

        [HttpPost]
        public async Task CreateAlbumWithNewPhotos([FromBody] NewAlbum album)
        {
            await _service.CreateAlbumWithNewPhotos(album);
        }
        [HttpPost]
        public async Task CreateAlbumWithExistPhotos([FromBody] NewAlbum album)
        {
            await _service.CreateAlbumWithNewPhotos(album);
        }
    }
}