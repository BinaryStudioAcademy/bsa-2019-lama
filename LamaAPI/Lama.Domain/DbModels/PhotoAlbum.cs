﻿using Newtonsoft.Json;

namespace Lama.Domain.DbModels
{
    public partial class PhotoAlbum
    {
        public int PhotoId { get; set; }
        public int AlbumId { get; set; }

        [JsonIgnore]
        public Photo Photo { get; set; }
        [JsonIgnore]
        public Album Album { get; set; }
    }
}
