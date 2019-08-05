using Newtonsoft.Json;

namespace Lama.DataAccess.Models
{
    public partial class SharedAlbum
    {
        public int Id { get; set; }
        public int AlbumId { get; set; }
        public int UserId { get; set; }

        [JsonIgnore]
        public Album Album { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}
