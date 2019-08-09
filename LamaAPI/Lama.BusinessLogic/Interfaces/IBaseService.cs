using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IBaseService<T> where T : class
    {
        Task<IEnumerable<T>> FindAll();
        Task<int> Create(T item);
        Task<T> Update(T item, object key);
        Task<int> Delete(T id);
    }
}
