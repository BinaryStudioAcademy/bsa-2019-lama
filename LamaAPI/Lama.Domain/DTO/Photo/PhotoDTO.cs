using System.Collections.Generic;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Album;
using Lama.Domain.DTO.Reaction;
using Lama.Domain.DTO.User;

namespace Lama.Domain.DTO.Photo
{
    public  class PhotoDTO
    {
        public int Id { get; set; }

        
        public PhotoState PhotoState { get; set; }
        
        public ICollection<LikeDTO> Likes { get; set; }
        
        public ICollection<CommentDTO> Comments { get; set; }
        
        public ICollection<FavoriteDTO> Favorites { get; set; }

        
        public UserDTO User { get; set; }
    }
}