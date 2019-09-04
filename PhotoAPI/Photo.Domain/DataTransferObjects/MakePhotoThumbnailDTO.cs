using System;

namespace Photo.Domain.DataTransferObjects
{
    [Serializable]
    public class ImageToProcessDTO
    {
        public long ImageId { get; set; }
        public int UserId { get; set; }
        public Enums.ImageType ImageType { get; set; }

    }
}
