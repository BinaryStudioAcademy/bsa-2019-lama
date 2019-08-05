using Newtonsoft.Json;

namespace Lama.DataAccess.Models
{
    public partial class Location
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }
    }
}
