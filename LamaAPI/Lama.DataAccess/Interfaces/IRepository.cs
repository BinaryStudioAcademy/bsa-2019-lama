using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Linq;

namespace Lama.DataAccess.Interfaces
{
    public interface IRepository<TEntity> where TEntity : class
    { 
        Task<int> CountAsync();
        Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate);

        Task<IEnumerable<TEntity>> GetAsync(Expression<Func<TEntity, bool>> filter = null,
                                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                    string includeProperties = "",
                                    int? page = null, int? amount = null);
        Task<TEntity> GetAsync(int id);

        Task InsertAsync(TEntity entity);

        Task DeleteAsync(object id);
        void Delete(TEntity entityToDelete);
        void Delete(Expression<Func<TEntity, bool>> predicate);
    }
}
