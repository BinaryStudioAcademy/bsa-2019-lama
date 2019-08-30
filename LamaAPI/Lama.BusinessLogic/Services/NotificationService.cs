using Lama.BusinessLogic.Hubs;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Notification;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> Hub;
        private readonly ApplicationDbContext Context;
        public NotificationService(IHubContext<NotificationHub> Hub, ApplicationDbContext Context)
        {
            this.Context = Context;
            this.Hub = Hub;
        }
        public async Task SendNotificationAboutLike(int Id,string name)
        {
            string noti = $"{name} : Liked your photo";
            var model = await CreateNotification(noti, Id);

            var message = new NotificationDTO()
            {
                Id = model.Id,
                Date = model.Date,
                IsRead = model.IsRead,
                Text = model.Text
            };
            var user = await Context.Users.FirstOrDefaultAsync(x => x.Id == Id);
            var email = user.Email;
            await Hub.Clients.User(email).SendAsync("Notification", message);
        }
        public async Task<Notification> CreateNotification(string Notification,int UserId)
        {
            var notification = new Notification()
            {
                Text = Notification,
                Date = DateTime.Now,
                IsRead = false,
                UserId = UserId
            };
            var value = await Context.Notifications.AddAsync(notification);
            await Context.SaveChangesAsync();
            return value.Entity;
        }
    }
}
