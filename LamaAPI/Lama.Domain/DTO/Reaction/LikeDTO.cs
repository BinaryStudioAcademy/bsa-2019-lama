using System;
using System.Collections.Generic;
using System.Text;
using Lama.Domain.DTO.Photo;
using Lama.Domain.DTO.User;

namespace Lama.Domain.DTO.Reaction
{
    public class LikeDTO
    {
        public int UserId { set; get; }
        
        public int PhotoId { set; get; }
        public PhotoDTO Photo { get; set; }
        
        public UserDTO User { get; set; }
    }
}
