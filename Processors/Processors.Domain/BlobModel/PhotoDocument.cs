using System.Collections.Generic;

namespace Processors.Domain.BlobModel
{
    public class PhotoDocument
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string BlobId { get; set; }
        public string Blob64Id { get; set; }
        public string Blob256Id { get; set; }
        public string OriginalBlobId { get; set; }
        public string SharedLink { get; set; }
        public bool IsDeleted { get; set; }
        public System.DateTime UploadDate { get; set; } = System.DateTime.Now;
        public string Description { get; set; }
        public string Location { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public string Coordinates { set; get; }
        public string ImageTags { get; set; }
        public string ImageDescription { get; set; }
        public List<bool> Hash { get; set; }
    }
}