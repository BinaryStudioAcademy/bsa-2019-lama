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
        Task SendNotificationAboutLike(int Id,User name);
        Task<List<NotificationDTO>> GetNotification(int userId);
        Task SendIsRead(int id);
    }
}
