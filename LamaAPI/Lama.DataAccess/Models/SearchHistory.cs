using Newtonsoft.Json;
using System;

namespace Lama.DataAccess.Models
{
    public partial class SearchHistory
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime SearchDate { get; set; }
        public int UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }
    }
}
