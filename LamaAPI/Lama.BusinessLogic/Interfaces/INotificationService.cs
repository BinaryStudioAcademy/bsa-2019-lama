using Lama.Domain.DbModels;
using Lama.Domain.DTO.Notification;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface INotificationService
    {
        Task SendNotification(int Id,User name,string noti);
        Task<List<NotificationDTO>> GetNotification(int userId);
        Task SendIsRead(int id);
        Task MarkAllIsARead(int id);
    }
}
