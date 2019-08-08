using Newtonsoft.Json;

namespace Lama.Domain.DbModels
{
    public partial class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public int PhotoId { get; set; }
        public int UserId { get; set; }

        [JsonIgnore]
        public Photo Photo { get; set; }
        [JsonIgnore]
        public User User { get; set; }
    }
}
