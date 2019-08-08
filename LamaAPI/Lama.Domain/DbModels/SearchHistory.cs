using System;
using Newtonsoft.Json;

namespace Lama.Domain.DbModels
{
    public partial class SearchHistory
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime SearchDate { get; set; }
        public string UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }
    }
}
