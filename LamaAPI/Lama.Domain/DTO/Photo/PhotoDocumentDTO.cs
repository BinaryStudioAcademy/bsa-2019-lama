using like = Lama.Domain.DTO.Reaction;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.Photo
{
    public class PhotoDocumentDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string BlobId { get; set; }
        public string Blob64Id { get; set; }
        public string Blob256Id { get; set; }
        public string OriginalBlobId { get; set; }
        public string SharedLink { get; set; }
        public bool IsDeleted { get; set; }
        public bool IsDuplicate { get; set; }
        public DateTime UploadDate { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public string Coordinates { set; get; }
        public IEnumerable<like.LikeDTO> Reactions {set;get;}
    }
}
