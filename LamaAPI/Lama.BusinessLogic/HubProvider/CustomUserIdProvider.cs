using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.BusinessLogic.HubProvider
{
    public class CustomUserIdProvider: IUserIdProvider
    {
        public virtual string GetUserId(HubConnectionContext connection)
        {
            string FindKey = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

            var s = connection.User.Identities;
            foreach(var g in s)
            {
                foreach(var h in g.Claims)
                {
                    if(h.Type == FindKey)
                    {
                        return h.Value;
                    }
                }
            }
            return null;
        }
    }
}
