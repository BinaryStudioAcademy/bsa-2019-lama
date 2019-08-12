using Microsoft.EntityFrameworkCore;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Lama.DataAccess.Repositories
{
    public class Repository<TEntity> : Interfaces.IRepository<TEntity>
        where TEntity : class
    {
        // FIELDS
        protected readonly ApplicationDbContext dbContext;
        protected readonly DbSet<TEntity> entities;

        // CONSTRUCTORS
        public Repository(ApplicationDbContext context)
        {
            this.dbContext = context;
            this.entities = context.Set<TEntity>();
        }

        // METHODS
        public virtual Task<int> CountAsync()
        {
            return entities.CountAsync();
        }
        public virtual Task<int> CountAsync(Expression<Func<TEntity, bool>> predicate)
        {
            return entities.CountAsync(predicate);
        }

        public virtual async Task<IEnumerable<TEntity>> GetAsync(Expression<Func<TEntity, bool>> filter = null,
                                                    Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
                                                    string includeProperties = "",
                                                    int? page = null, int? amount = null)
        {
            // filter
            IQueryable<TEntity> query = entities;
            if (filter != null)
            {
                query = query.Where(filter);
            }

            // include properties
            foreach (string includeProperty in includeProperties.Split(new char[] { ',', ' ' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }

            // ordering
            if (orderBy != null) query = orderBy(query);

            // paging
            if (page.HasValue && amount.HasValue) query = query.Skip((page.Value - 1) * amount.Value).Take(amount.Value);

            return await query.ToArrayAsync();
        }

        public virtual Task<TEntity> GetAsync(int id)
        {
            return entities.FindAsync(id);
        }

        public virtual async Task<TEntity> InsertAsync(TEntity entity)
        {
            return (await entities.AddAsync(entity)).Entity;
        }

        public virtual async Task DeleteAsync(object id)
        {
            // find
            if (id == null) throw new ArgumentNullException(nameof(id));
            TEntity entityToDelete = await entities.FindAsync(id);

            // delete finded
            if (entityToDelete == null) throw new InvalidOperationException("There is no records with such id");
            Delete(entityToDelete);
        }
        public virtual void Delete(TEntity entityToDelete)
        {
            if (entityToDelete == null) throw new ArgumentNullException(nameof(entityToDelete));

            if (dbContext.Entry(entityToDelete).State == EntityState.Detached)
            {
                entities.Attach(entityToDelete);
            }
            entities.Remove(entityToDelete);
        }
        public virtual void Delete(Expression<Func<TEntity, bool>> predicate)
        {
            if (predicate != null) entities.RemoveRange(entities.Where(predicate));
            else entities.RemoveRange(entities);
        }
    }
}
