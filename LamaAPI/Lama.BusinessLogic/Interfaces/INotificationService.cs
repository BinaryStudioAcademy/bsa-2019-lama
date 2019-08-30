using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface INotificationService
    {
        Task SendNotificationAboutLike(int Id,string name);
    }
}
