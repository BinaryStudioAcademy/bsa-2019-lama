using Newtonsoft.Json;

namespace Lama.DataAccess.Models
{
    public partial class VideoAlbum
    {
        public int VideoId { get; set; }
        public int AlbumId { get; set; }
        
        [JsonIgnore]
        public Video Video { get; set; }
        [JsonIgnore]
        public Album Album { get; set; }
    }
}
