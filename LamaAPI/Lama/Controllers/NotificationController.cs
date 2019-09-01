using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DTO.Notification;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService notificationService;

        public NotificationController(INotificationService notificationService)
        {
            this.notificationService = notificationService;
        }

        [HttpGet("{id}")]
        public async Task<IEnumerable<NotificationDTO>> GetNotification(int id)
        {
            return await this.notificationService.GetNotification(id);
        }

        [HttpPost]
        public async Task UpdateIsRead([FromBody] int id)
        {
            await notificationService.SendIsRead(id);
        }
        [HttpPost("markAll")]
        public async Task MarkAllIsARead([FromBody] int id)
        {
            await notificationService.MarkAllIsARead(id);
        }
        [HttpDelete("{id}")]
        public async Task DeleteNotification(int id)
        {
            await notificationService.DeleteNotification(id);
        }
    }
}