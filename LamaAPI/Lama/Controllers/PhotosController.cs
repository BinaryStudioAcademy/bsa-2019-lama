using System;
using Lama.Domain.DbModels;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhotosController
    {
        [HttpGet("{id}")]
        public ActionResult<SharedImage> Get(int id)
        {
            var photoDoc = new SharedImage
            {
                UserId = 1,
                BlobId = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTe91xLeKqjSUdroQovkZHKyEwGZ3d8wmR6RR2GcmboXaDwxf1K",
                PhotoId = 1,
                
            };
            
            return photoDoc;
        }
    }

    public class PhotoDocument
    {
        public int Id { get; set; }
        public string BlobId { get; set; }
        public string Blob16Id { get; set; }
        public string Blob32Id { get; set; }
        public string OriginalBlobId { get; set; }
        public string SharedLink { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime UploadDate { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
    }

    public class SharedImage
    {
        public int UserId { get; set; }
        public string BlobId { get; set; }
        public int PhotoId { get; set; }
    }

}