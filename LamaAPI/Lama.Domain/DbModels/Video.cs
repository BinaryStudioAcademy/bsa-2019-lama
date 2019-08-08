using Newtonsoft.Json;
using System.Collections.Generic;

namespace Lama.Domain.DbModels
{
    public partial class Video
    {
        public Video()
        {
            VideoAlbums = new HashSet<VideoAlbum>();
        }

        public int Id { get; set; }
        public int BlobId { get; set; }
        public string UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }
        [JsonIgnore]
        public ICollection<VideoAlbum> VideoAlbums { get; set; }
    }
}
