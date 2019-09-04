using Newtonsoft.Json;

namespace Lama.Domain.DbModels
{
    public partial class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int UserId { get; set; }
        
        public int Count { get; set; }

        [JsonIgnore]
        public User User { get; set; }
    }
}
