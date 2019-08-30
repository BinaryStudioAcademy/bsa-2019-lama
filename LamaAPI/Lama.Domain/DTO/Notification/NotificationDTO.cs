using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.Notification
{
    public class NotificationDTO
    {
        public int Id { set; get; }
        public string Text { set; get; }
        public DateTime Date { set; get; }
        public bool IsRead { set; get; }
        public NotificationUserDTO Sender { set; get; }
    }
}
