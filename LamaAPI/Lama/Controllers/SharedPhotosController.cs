using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;
using Lama.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SharedPhotosController: ControllerBase
    {
        private readonly ISharingPhotoService _sharingPhotoService;
        private readonly IUserProtectionService _userProtectionService;

        public SharedPhotosController(ISharingPhotoService sharingPhotoService, IUserProtectionService userProtectionService)
        {
            _sharingPhotoService = sharingPhotoService;
            _userProtectionService = userProtectionService;
        }

        [HttpDelete("{id}")]
        public async Task Delete(int id)
        {
            await _sharingPhotoService.Delete(id);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<SharedPhotoDTO> GetSharedPhoto(int id)
        {
            return await _sharingPhotoService.Get(id);
        }

        [HttpGet("user/{id}")]
        public async Task<IEnumerable<PhotoAlbumDTO>> GetUsersSharedPhoto(int id)
        {
            return await _sharingPhotoService.GetUsersSharedPhoto(id);
        }

        [HttpPost]
        public async Task PostSharedPhoto([FromBody] SharedPhoto sharedPhoto)
        { 
            await _sharingPhotoService.ProcessSharedPhoto(sharedPhoto);
		}
		
        [AllowAnonymous]
        [HttpPut("{id}")]
        public async Task<PhotoDocument> UpdateSharedPhotoWithLink(int id)
        {
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                var sharedLink = await reader.ReadToEndAsync();
                return await _sharingPhotoService.UpdatePhotoDocumentWithSharedLink(id, sharedLink);
            }
        }
    }
}