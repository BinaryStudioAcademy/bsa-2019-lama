using Newtonsoft.Json;
using System.Collections.Generic;

namespace Lama.DataAccess.Models
{
    public partial class Photo
    {
        public Photo()
        {
            Likes = new HashSet<Like>();
            Comments = new HashSet<Comment>();
            Favorites = new HashSet<Favorite>();
            PhotoAlbums = new HashSet<PhotoAlbum>();
        }

        public int Id { get; set; }
        public int ElasticId { get; set; }

        [JsonIgnore]
        public PhotoState PhotoState { get; set; }
        [JsonIgnore]
        public ICollection<Like> Likes { get; set; }
        [JsonIgnore]
        public ICollection<Comment> Comments { get; set; }
        [JsonIgnore]
        public ICollection<Favorite> Favorites { get; set; }
        [JsonIgnore]
        public Album Album { get; set; }
        [JsonIgnore]
        public ICollection<PhotoAlbum> PhotoAlbums { get; set; }
        [JsonIgnore]
        public SharedPhoto SharedPhoto { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}
