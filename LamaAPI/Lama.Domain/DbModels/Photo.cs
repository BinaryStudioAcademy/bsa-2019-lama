using Newtonsoft.Json;
using System.Collections.Generic;

namespace Lama.Domain.DbModels
{
    public partial class Photo
    {
        public Photo()
        {
            Likes = new HashSet<Like>();
            Comments = new HashSet<Comment>();
            Favorites = new HashSet<Favorite>();
            PhotoAlbums = new HashSet<PhotoAlbum>();
            SharedPhotos = new HashSet<SharedPhoto>();
        }

        public int Id { get; set; }
        public int UserId { get; set; }
        
        public int CategoryId { get; set; }

        [JsonIgnore]
        public PhotoState PhotoState { get; set; }
        [JsonIgnore]
        public ICollection<Like> Likes { get; set; }
        [JsonIgnore]
        public ICollection<Comment> Comments { get; set; }
        [JsonIgnore]
        public ICollection<Favorite> Favorites { get; set; }
        [JsonIgnore]
        public ICollection<Album> Album { get; set; }
        [JsonIgnore]
        public ICollection<PhotoAlbum> PhotoAlbums { get; set; }
        [JsonIgnore]
        public ICollection<SharedPhoto> SharedPhotos { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}
