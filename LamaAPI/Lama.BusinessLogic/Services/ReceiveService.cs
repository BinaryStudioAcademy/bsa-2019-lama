using Lama.DataAccess.Interfaces;
using Lama.Domain.DbModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Services
{
    public class ReceiveService
    {
        IUnitOfWork _context;
        public ReceiveService(IUnitOfWork context)
        {
            _context = context;
        }
        public async Task Post(int id)
        {
            await _context.GetRepository<Photo>().InsertAsync(new Photo
            {
                ElasticId = id
            });
            await _context.SaveAsync();
        }
    }
}
