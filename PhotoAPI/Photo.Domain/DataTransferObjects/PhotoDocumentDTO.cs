using Photo.Domain.DataTransferObjects.Reaction;
using System;
using System.Collections.Generic;


namespace Photo.Domain.DataTransferObjects
{
    public class PhotoDocumentDTO
    {
        public int Id { get; set; }
        public string BlobId { get; set; }
        public string Blob64Id { get; set; }
        public string Blob256Id { get; set; }
        public string OriginalBlobId { get; set; }
        public string SharedLink { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime UploadDate { get; set; }
        public string Description { get; set; }
        public string Location { get; set; }
        public int UserId { get; set; }
        public int CategoryId { get; set; }
        public ReactionDTO[] Reactions { set; get; }
        public IEnumerable<ImageTagDTO> Tags { get; set; }
        public IEnumerable<TextOnPhotoDTO> Text { get; set; }
    }
}
