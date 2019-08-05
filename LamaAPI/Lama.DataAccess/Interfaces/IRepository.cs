using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Lama.DataAccess.Interfaces
{
    public interface IRepository<T> where T : class
    {
        Task<List<T>> GetAllAsync();
        Task<IEnumerable<T>> FindAsync(Func<T, Boolean> predicate);
        Task CreateAsync(T item);
        Task<T> ReadAsync(int id);
        Task UpdateAsync(int id, T item);
        Task DeleteAsync(int id);
    }
}
