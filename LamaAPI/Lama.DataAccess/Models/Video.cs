﻿using Newtonsoft.Json;
using System.Collections.Generic;

namespace Lama.DataAccess.Models
{
    public partial class Video
    {
        public Video()
        {
            VideoAlbums = new HashSet<VideoAlbum>();
        }

        public int Id { get; set; }
        public int BlobId { get; set; }
        public int UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }
        [JsonIgnore]
        public ICollection<VideoAlbum> VideoAlbums { get; set; }
    }
}
