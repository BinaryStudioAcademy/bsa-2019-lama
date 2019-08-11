using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Lama.BusinessLogic.Services;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
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
        public async Task<Photo> GetSharedPhoto(int id)
        {
            return await _sharingPhotoService.Get(id);
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