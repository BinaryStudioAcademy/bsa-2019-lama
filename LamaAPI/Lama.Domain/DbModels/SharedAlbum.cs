using Newtonsoft.Json;

namespace Lama.Domain.DbModels
{
    public partial class SharedAlbum
    {
        public int Id { get; set; }
        public int AlbumId { get; set; }
        public string UserId { get; set; }

        [JsonIgnore]
        public Album Album { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}
