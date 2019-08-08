using Newtonsoft.Json;

namespace Lama.Domain.DbModels
{
    public partial class Location
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }
    }
}
