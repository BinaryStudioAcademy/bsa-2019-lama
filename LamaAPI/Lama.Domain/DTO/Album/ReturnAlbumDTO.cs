using Lama.Domain.BlobModels;
using Lama.Domain.DTO.User;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.Album
{
    public class ReturnAlbumDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public PhotoDocument Photo { get; set; }
        public IEnumerable<PhotoDocument> PhotoAlbums { get; set; }
    }
}
