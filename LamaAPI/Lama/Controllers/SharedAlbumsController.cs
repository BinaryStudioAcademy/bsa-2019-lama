using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lama.BusinessLogic.Services;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Album;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SharedAlbumsController : ControllerBase
    {
        private readonly SharingAlbumService _sharingAlbumService;

        public SharedAlbumsController(SharingAlbumService sharingAlbumService)
        {
            _sharingAlbumService = sharingAlbumService;
        }

        [HttpGet("{id}")]
        public async Task<Album> GetSharedPhoto(int id)
        {
            return await _sharingAlbumService.Get(id);
        }

        [HttpGet("user/{id}")]
        public async Task<IEnumerable<ReturnAlbumDTO>> GetSharedUserAlbums(int id)
        {
            return await _sharingAlbumService.GetSharedAlbums(id);
        }

        [HttpPost]
        public async Task PostSharedPhoto([FromBody] SharedAlbum sharedAlbum)
        {
            await _sharingAlbumService.SharingAlbum(sharedAlbum);
        }

        [HttpDelete("{id}")]
        public async Task RemoveSharedAlbum(int id)
        {
            await _sharingAlbumService.Delete(id);
        }

        [HttpDelete("{id}/{userId}")]
        public async Task RemoveSharedAlbum(int id, int userId)
        {
            await _sharingAlbumService.DeleteForUser(id, userId);
        }
    }
}