using Nest;
using Photo.BusinessLogic.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;

namespace Photo.BusinessLogic.Services
{
    public abstract class BaseService<T> : IBaseService<T> where T : class
    {
        public Task<CreateResponse> Create(T item)
        {
            throw new NotImplementedException();
        }

        public Task Delete(int id)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<PhotoDocument>> Get()
        {
            throw new NotImplementedException();
        }

        public Task<PhotoDocument> Get(int id)
        {
            throw new NotImplementedException();
        }

        public Task Update(T item)
        {
            throw new NotImplementedException();
        }
    }
}
