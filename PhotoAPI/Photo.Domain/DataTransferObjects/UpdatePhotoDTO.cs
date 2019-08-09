namespace Photo.Domain.DataTransferObjects
{
    public class UpdatePhotoDTO
    {
        public int Id { get; set; }
        public string BlobId { get; set; }
        public string ImageBase64 { get; set; }
    }
}
