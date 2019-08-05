using Newtonsoft.Json;
using System.Collections.Generic;

namespace Lama.DataAccess.Models
{
    public partial class Album
    {
        public Album()
        {
            PhotoAlbums = new HashSet<PhotoAlbum>();
            VideoAlbums = new HashSet<VideoAlbum>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public string SharedLink { get; set; }

        public int CoverId { get; set; }
        public int UserId { get; set; }
        

        [JsonIgnore]
        public Photo Photo { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        [JsonIgnore]
        public ICollection<PhotoAlbum> PhotoAlbums { get; set; }
        [JsonIgnore]
        public ICollection<VideoAlbum> VideoAlbums { get; set; }
        [JsonIgnore]
        public SharedAlbum SharedAlbum { get; set; }
    }
}
