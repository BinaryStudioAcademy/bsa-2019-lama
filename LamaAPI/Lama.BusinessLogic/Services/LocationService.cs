using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Lama.Domain.DbModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Services
{
    public class LocationService : ILocationService
    {
        readonly ApplicationDbContext Context;
        public LocationService(ApplicationDbContext Context)
        {
            this.Context = Context;
        }
        public async Task<int> CheckAdrress(string shortLocation)
        {
            var loca = await Context.Locations.FirstOrDefaultAsync(x => x.Name == shortLocation);
            if(loca == null)
            {
                var newLocation = new Location() { Name = shortLocation };
                loca = (await Context.Locations.AddAsync(newLocation)).Entity;
            }
            return loca.Id;
        }
    }
}
