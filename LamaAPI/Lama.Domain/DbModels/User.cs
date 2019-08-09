using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace Lama.Domain.DbModels
{
    public partial class User
    {
        public User()
        {
            Categories = new HashSet<Category>();
            Notifications = new HashSet<Notification>();
            SearchHistories = new HashSet<SearchHistory>();
            Locations = new HashSet<Location>();
            Likes = new HashSet<Like>();
            Comments = new HashSet<Comment>();
            Favorites = new HashSet<Favorite>();
            Albums = new HashSet<Album>();
            Videos = new HashSet<Video>();
            SharedAlbums = new HashSet<SharedAlbum>();
            SharedPhotos = new HashSet<SharedPhoto>();
        }

        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? AvatarId { get; set; }

        [JsonIgnore]
        public ICollection<Category> Categories { get; set; }
        [JsonIgnore]
        public ICollection<Notification> Notifications { get; set; }
        [JsonIgnore]
        public ICollection<SearchHistory> SearchHistories { get; set; }
        [JsonIgnore]
        public ICollection<Location> Locations { get; set; }
        [JsonIgnore]
        public ICollection<Like> Likes { get; set; }
        [JsonIgnore]
        public ICollection<Comment> Comments { get; set; }
        [JsonIgnore]
        public ICollection<Favorite> Favorites { get; set; }
        [JsonIgnore]
        public ICollection<Album> Albums { get; set; }
        [JsonIgnore]
        public ICollection<Video> Videos { get; set; }
        [JsonIgnore]
        public ICollection<SharedAlbum> SharedAlbums { get; set; }
        [JsonIgnore]
        public ICollection<SharedPhoto> SharedPhotos { get; set; }
        [JsonIgnore]
        public Photo Photo { get; set; }
    }
}
