using Lama.Domain.BlobModels;
using Lama.Domain.DTO.Photo;
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
        public PhotoDocumentDTO Photo { get; set; }
        public IEnumerable<PhotoDocumentDTO> PhotoAlbums { get; set; }
    }
}
