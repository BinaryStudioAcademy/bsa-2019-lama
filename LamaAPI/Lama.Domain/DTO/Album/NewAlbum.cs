using Lama.Domain.DTO.Photo;
using Lama.Domain.DTO.User;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.Album
{
    public class NewAlbum
    {
        public string Title { set; get; }
        public NewPhoto Photo { set; get;}
        public int AuthorId { set; get; }
        public NewPhoto[] Photos { set; get; }
    }
}
