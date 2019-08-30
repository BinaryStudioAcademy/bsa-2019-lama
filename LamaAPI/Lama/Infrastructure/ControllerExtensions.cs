using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Lama.DataAccess;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace Lama.Infrastructure
{
    public static class ControllerExtensions
    {
        public static T GetClaim<T>(this ControllerBase controller, string claimType)
        {
            var claim = (T)System.Convert.ChangeType(controller.User.FindFirst(claimType).Value, typeof(T));
            return claim;
        }

        public static string GetUserEmail(this ControllerBase controller)
        {
            var email = controller.User.Claims.FirstOrDefault(x => x.Type.Contains("emailaddress"))?.Value;
            return email;
        }
    }
}
