using Lama.BusinessLogic.Hubs;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Notification;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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
        public async Task SendNotification(int id, User user,string notification)
        {
            var model = await CreateNotification(notification, id, user);

            var sender = new NotificationUserDTO()
            {
                ImageUrl = user.AvatarUrl,
                Name = user.FirstName + " " + user.LastName
            };
            var message = new NotificationDTO()
            {
                Id = model.Id,
                Date = model.Date,
                IsRead = model.IsRead,
                Text = model.Text,
                Sender = sender
            };
            var user2 = await Context.Users.FirstOrDefaultAsync(x => x.Id == id);
            var email = user2.Email;
            await Hub.Clients.User(email).SendAsync("Notification", message);
        }

        private async Task<Notification> CreateNotification(string Notification,int UserId, User user)
        {
            var notification = new Notification()
            {
                Text = Notification,
                Date = DateTime.Now,
                IsRead = false,
                UserId = UserId,
                Sender = user
            };
            var value = await Context.Notifications.AddAsync(notification);
            await Context.SaveChangesAsync();
            return value.Entity;
        }

        public async Task<List<NotificationDTO>> GetNotification(int userId)
        {
            var list = await Context.Notifications.Include(x=>x.Sender).Where(x => x.UserId == userId).ToListAsync();
            var returnList = new List<NotificationDTO>();
            foreach(var item in list)
            {
                var user = new NotificationUserDTO()
                {
                    ImageUrl = item.Sender.AvatarUrl,
                    Name = item.Sender.FirstName + " " + item.Sender.LastName
                };
                var notif = new NotificationDTO()
                {
                    Id = item.Id,
                    Date = item.Date,
                    IsRead = item.IsRead,
                    Sender = user,
                    Text = item.Text
                };
                returnList.Add(notif);
            }
            return returnList;
        }

        public async Task SendIsRead(int id)
        {
            var notification = await Context.Notifications.FirstOrDefaultAsync(x => x.Id == id);
            notification.IsRead = true;
            Context.Notifications.Update(notification);
            await Context.SaveChangesAsync();
        }
        public async Task MarkAllIsARead(int id)
        {
            var notifications = Context.Notifications.Where(x => x.UserId == id && x.IsRead == false);
            foreach(var item in notifications)
            {
                item.IsRead = true;
            }
            Context.Notifications.UpdateRange(notifications);
            await Context.SaveChangesAsync();
        }
    }
}
