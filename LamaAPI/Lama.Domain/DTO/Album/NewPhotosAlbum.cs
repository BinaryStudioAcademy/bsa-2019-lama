using Lama.Domain.DTO.Photo;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.Album
{
    public class NewPhotosAlbum
    {
        public int UserId { set; get; }
        public int AlbumId { set; get; }
        public NewPhoto[] Photos {set;get;}
    }
}
