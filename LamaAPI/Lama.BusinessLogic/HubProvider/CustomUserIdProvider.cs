using System.Linq;
using Microsoft.AspNetCore.SignalR;


namespace Lama.BusinessLogic.HubProvider
{
    public class CustomUserIdProvider: IUserIdProvider
    {
        public virtual string GetUserId(HubConnectionContext connection)
        {
            const string findKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

            var userIdentities = connection.User.Identities;
            return (from identity in userIdentities from claim in identity.Claims where claim.Type == findKey select claim.Value).FirstOrDefault();
        }
    }
}
