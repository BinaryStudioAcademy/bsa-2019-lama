using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.Album
{
    public class UpdateAlbumDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public int[] PhotoIds { get; set; }
    }
}
