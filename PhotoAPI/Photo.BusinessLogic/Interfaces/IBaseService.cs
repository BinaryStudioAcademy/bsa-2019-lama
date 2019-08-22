using Nest;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IBaseService<T> where T : class
    {
        Task<IEnumerable<T>> Get();
        Task<T> Get(int id);
        Task<CreateResponse> Create(T item);
        Task Update(T item);
        Task Delete(int id);
    }
}
