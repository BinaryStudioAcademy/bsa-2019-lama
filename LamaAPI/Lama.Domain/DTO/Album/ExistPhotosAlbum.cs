using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.Album
{
    public class ExistPhotosAlbum
    {
        public int AlbumId { set; get; }
        public int[] PhotosId { set; get; }
    }
}
