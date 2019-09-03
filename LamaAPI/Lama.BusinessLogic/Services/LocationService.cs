using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.BusinessLogic.Services
{
    public class LocationService : ILocationService
    {
        readonly ApplicationDbContext Context;
        public LocationService(ApplicationDbContext Context)
        {
            this.Context = Context;
        }
        public string CheckAdrress(string shortLocation)
        {
            return null;
        }
    }
}
