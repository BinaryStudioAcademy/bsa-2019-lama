using Lama.Domain.DTO.Photo;
using Lama.Domain.DTO.User;

namespace Lama.Domain.DTO
{
    //TODO: Resolve LikeDTO issue. We have 2 instances now, and need to decide which one to use
    public class LikeDTO
    {
        public int Id { get; set; }
        
        public PhotoDTO Photo { get; set; }
        
        public UserDTO User { get; set; }
    }
}