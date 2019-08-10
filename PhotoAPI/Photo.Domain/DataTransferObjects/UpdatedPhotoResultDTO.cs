namespace Photo.Domain.DataTransferObjects
{
    public class UpdatedPhotoResultDTO
    {
        public string BlobId { get; set; }
        public string Blob64Id { get; set; }
        public string Blob256Id { get; set; }
    }
}
