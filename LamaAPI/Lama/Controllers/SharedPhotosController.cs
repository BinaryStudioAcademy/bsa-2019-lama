using System.IO;
using System.Text;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;
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

        public SharedPhotosController(ISharingPhotoService sharingPhotoService)
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
            using (var reader = new StreamReader(Request.Body, Encoding.UTF8))
            {
                var sharedLink = await reader.ReadToEndAsync();
                return await _sharingPhotoService.UpdatePhotoDocumentWithSharedLink(id, sharedLink);
            }
        }
    }
}