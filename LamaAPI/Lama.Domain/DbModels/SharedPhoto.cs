using Newtonsoft.Json;

namespace Lama.Domain.DbModels
{
    public partial class SharedPhoto
    {
        public int Id { get; set; }
        public int PhotoId { get; set; }
        public string UserId { get; set; }

        [JsonIgnore]
        public Photo Photo { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}
