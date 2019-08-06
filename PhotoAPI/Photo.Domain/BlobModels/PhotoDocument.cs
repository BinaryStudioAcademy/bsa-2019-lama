using System;
using System.Collections.Generic;
using System.Text;

namespace Photo.Domain.BlobModels
{
    public partial class PhotoDocument
    {
        public long BlobId { get; set; }
        public short Blob16Id { get; set; }
        public int Blob32Id { get; set; }
        public decimal OriginalBlobId { get; set; }
        public string SharedLink { get; set; }
        public bool IsDeleted { get; set; } 
        public DateTime UploadDate { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
    }
}
