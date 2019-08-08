using System;
using Newtonsoft.Json;

namespace Lama.Domain.DbModels
{
    public partial class Notification
    {
        public int Id { get; set; }
        public string Text { get; set; }
        public DateTime Date { get; set; }
        public bool IsRead { get; set; }
        public string UserId { get; set; }

        [JsonIgnore]
        public User User { get; set; }
    }
}
