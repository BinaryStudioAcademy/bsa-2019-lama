namespace Photo.Domain.DataTransferObjects
{
    public class MakePhotoThumbnailDTO
    {
        public long ImageId { get; set; }
        public Enums.ImageType ImageType { get; set; }
    }
}
