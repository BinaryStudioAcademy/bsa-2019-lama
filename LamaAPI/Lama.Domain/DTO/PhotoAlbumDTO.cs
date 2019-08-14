using Lama.Domain.DTO.Album;
using Lama.Domain.DTO.Photo;

namespace Lama.Domain.DTO
{
    public class PhotoAlbumDTO
    {
        public PhotoDTO Photo { get; set; }
        
        public ReturnAlbumDTO AlbumDto { get; set; }
    }
}