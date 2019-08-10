using System.Collections.Generic;
using System.Threading.Tasks;
using Lama.BusinessLogic.Services;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SharedPhotosController: ControllerBase
    {
        private readonly SharingPhotoService _sharingPhotoService;

        public SharedPhotosController(SharingPhotoService sharingPhotoService)
        {
            _sharingPhotoService = sharingPhotoService;
        }
        
        [HttpGet("{id}")]
        public async Task<Photo> GetSharedPhoto(int id)
        {
            return await _sharingPhotoService.Get(id);
        }

        [HttpPost]
        public async Task PostSharedPhoto([FromBody] SharedPhoto sharedPhoto)
        {
            await _sharingPhotoService.SharingPhoto(sharedPhoto);
        }
    }
}