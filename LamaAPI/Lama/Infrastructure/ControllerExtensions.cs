using Microsoft.AspNetCore.Mvc;

namespace Lama.Infrastructure
{
    public static class ControllerExtensions
    {
        public static T GetClaim<T>(this ControllerBase controller, string claimType)
        {
            return (T)System.Convert.ChangeType(controller.User.FindFirst(claimType).Value, typeof(T));
        }
    }
}
