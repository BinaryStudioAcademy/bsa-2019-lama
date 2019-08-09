using Lama.Domain.DTO.Photo;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.Album
{
    public class NewAlbum
    {
        public string Name { set; get; }
        public string ImageUser { set; get;}
        public string Author { set; get; }
        public NewPhoto[] Photos { set; get; }
    }
}
