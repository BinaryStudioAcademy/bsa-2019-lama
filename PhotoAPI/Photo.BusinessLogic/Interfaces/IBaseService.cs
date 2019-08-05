using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Photo.BusinessLogic.Interfaces
{
    interface IBaseService<T> where T : class
    {
        Task<IEnumerable<T>> FindAll();
        Task<T> Get(int id);
        Task Create(T item);
        Task Update(T item);
        Task Delete(int id);
    }
}
