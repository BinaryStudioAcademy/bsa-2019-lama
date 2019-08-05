using Newtonsoft.Json;

namespace Lama.DataAccess.Models
{
    public partial class SharedPhoto
    {
        public int Id { get; set; }
        public int PhotoId { get; set; }
        public int UserId { get; set; }

        [JsonIgnore]
        public Photo Photo { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}
