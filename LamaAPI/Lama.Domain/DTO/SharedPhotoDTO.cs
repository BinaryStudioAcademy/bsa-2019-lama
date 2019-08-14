using Lama.Domain.DTO.Photo;
using Lama.Domain.DTO.User;

namespace Lama.Domain.DTO
{
    public class SharedPhotoDTO
    {
        public PhotoDTO Photo { get; set; }
        
        public UserDTO User { get; set; }
    }
}