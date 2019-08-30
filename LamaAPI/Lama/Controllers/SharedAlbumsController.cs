using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.BusinessLogic.Services;
using Lama.Domain.DbModels;
using Lama.Infrastructure;
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
        private readonly IUserProtectionService _userProtectionService;

        public SharedAlbumsController(SharingAlbumService sharingAlbumService, IUserProtectionService userProtectionService)
        {
            _sharingAlbumService = sharingAlbumService;
            _userProtectionService = userProtectionService;
        }

        [HttpGet("{id}")]
        public async Task<Album> GetSharedPhoto(int id)
        {
            return await _sharingAlbumService.Get(id);
        }

        [HttpPost]
        public async Task PostSharedPhoto([FromBody] SharedAlbum sharedAlbum)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            sharedAlbum.UserId = currentUserId;
            await _sharingAlbumService.SharingAlbum(sharedAlbum);
        }
    }
}