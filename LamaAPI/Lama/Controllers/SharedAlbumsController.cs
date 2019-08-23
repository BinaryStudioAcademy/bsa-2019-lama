using System.Threading.Tasks;
using Lama.BusinessLogic.Services;
using Lama.Domain.DbModels;
using Microsoft.AspNetCore.Authorization;
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

        [HttpPost]
        public async Task PostSharedPhoto([FromBody] SharedAlbum sharedAlbum)
        {
            await _sharingAlbumService.SharingAlbum(sharedAlbum);
        }
    }
}