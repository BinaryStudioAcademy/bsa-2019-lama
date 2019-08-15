using Lama.Domain.DTO.Photo;
using Lama.Domain.DTO.User;

namespace Lama.Domain.DTO
{
    public class FavoriteDTO
    {
        public int Id { get; set; }
        
        public PhotoDTO Photo { get; set; }
        
        public UserDTO User { get; set; } 
    }
}