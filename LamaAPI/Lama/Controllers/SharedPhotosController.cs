using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Lama.BusinessLogic.Services;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;
using Lama.Domain.DTO.Photo;
using Microsoft.AspNetCore.Http;
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
        public async Task<SharedPhotoDTO> GetSharedPhoto(int id)
        {
            return await _sharingPhotoService.Get(id);
        }
		
        [HttpPost]
        public async Task PostSharedPhoto([FromBody] SharedPhoto sharedPhoto)
        {
            await _sharingPhotoService.ProcessSharedPhoto(sharedPhoto);
		}
		
        [HttpPut("{id}")]
        public async Task<PhotoDocument> UpdateSharedPhotoWithLink(int id)
        {
            using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                var sharedLink = await reader.ReadToEndAsync();
                return await _sharingPhotoService.UpdatePhotoDocumentWithSharedLink(id, sharedLink);
            }
        }
    }
}