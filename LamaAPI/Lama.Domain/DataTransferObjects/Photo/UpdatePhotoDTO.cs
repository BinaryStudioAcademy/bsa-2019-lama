﻿namespace Lama.Domain.DataTransferObjects.Photo
{
    public class UpdatePhotoDTO
    {
        public long Id { get; set; }
        public string BlobId { get; set; }
        public string ImageBase64 { get; set; }
    }
}
