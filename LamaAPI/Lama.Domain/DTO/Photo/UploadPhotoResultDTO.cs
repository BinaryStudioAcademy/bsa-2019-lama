namespace Lama.Domain.DTO.Photo
{
    public class UploadPhotoResultDTO
    {
        public long Id { get; set; }
        public string BlobId { get; set; }
        public string Blob64Id { get; set; }
        public string Blob256Id { get; set; }
        public string OriginalBlobId { get; set; }
        public string SharedLink { get; set; }
        public bool IsDeleted { get; set; }
        public string Description { get; set; }
    }
}
