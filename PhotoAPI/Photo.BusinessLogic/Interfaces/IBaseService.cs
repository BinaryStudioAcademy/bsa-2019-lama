using Nest;
using System.Collections.Generic;
using System.Threading.Tasks;
using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IBaseService<T> where T : class
    {
        Task<IEnumerable<PhotoDocument>> Get();
        Task<PhotoDocument> Get(int id);
        Task<CreateResponse> Create(T item);
        Task Update(T item);
        Task Delete(int id);
    }
}
