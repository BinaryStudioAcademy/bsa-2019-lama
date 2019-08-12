using Lama.Domain.BlobModels;
using Lama.Domain.DTO.Photo;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.User
{
    public class UserDTO
    {
        public int? Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public CreatePhotoDTO Photo { get; set; }
        public string PhotoUrl { get; set; }
    }
}
