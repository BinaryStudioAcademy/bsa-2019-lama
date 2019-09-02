namespace Processors.Domain.DTO
{
    public class ImageToProcessDTO
    {
        public long ImageId { get; set; }
        public int UserId { get; set; }
        public ImageType ImageType { get; set; }
    }
}
