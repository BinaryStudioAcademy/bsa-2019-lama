using Lama.Domain.DbModels;
using Lama.Domain.DTO.Notification;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Lama.Domain.Enums;

namespace Lama.BusinessLogic.Interfaces
{
    public interface INotificationService
    {
        Task SendNotification(int? Id,User name,string notification, ActivityType type, string payload = null);
        Task<List<NotificationDTO>> GetNotification(int userId);
        Task SendIsRead(int id);
        Task MarkAllIsARead(int id);
        Task DeleteNotification(int id);
    }
}
