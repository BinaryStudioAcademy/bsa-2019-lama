﻿namespace Lama.Domain.DTO.Photo
{
    // use this to get deleted photos from server
    public class DeletedPhotoDTO
    {
        public int Id { get; set; }
        public string Blob256Id { get; set; }
    }
}
