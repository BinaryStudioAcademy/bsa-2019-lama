using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.Album
{
    public class AlbumWithExistPhotosDTO
    {
        public string Title { set; get; }
        public int AuthorId { set; get; }
        public int[] PhotosId { set; get; }
    }
}
