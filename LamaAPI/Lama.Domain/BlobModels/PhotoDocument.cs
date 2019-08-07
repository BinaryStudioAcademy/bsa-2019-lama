using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.BlobModels
{
    public partial class PhotoDocument
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
}
