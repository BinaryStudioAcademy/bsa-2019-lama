using System;
using System.Threading.Tasks;
using System.Collections.Concurrent;

using Lama.DataAccess.Interfaces;
using Lama.DataAccess.Repositories;

using Microsoft.EntityFrameworkCore;

namespace Lama.DataAccess
{
    public class UnitOfWork : IUnitOfWork, IDisposable
    {
        // FIELDS
        private readonly ApplicationDbContext dbContext;

        private readonly ConcurrentDictionary<Type, object> repositoriesFactory;

        // CONSTRUCTORS
        public UnitOfWork(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
            this.repositoriesFactory = new ConcurrentDictionary<Type, object>();
        }

        public void Dispose()
        {
            this.dbContext?.Dispose();
        }

        // METHODS
        public IRepository<TEntity> GetRepository<TEntity>() where TEntity : class
        {

            Type key = typeof(TEntity);

            return (IRepository<TEntity>)this.repositoriesFactory
                    .GetOrAdd(key, new Repository<TEntity>(dbContext));
        }

        public void Update<TEntity>(TEntity entityToUpdate) where TEntity : class
        {
            if (dbContext.Entry(entityToUpdate).State == EntityState.Detached)
            {
                dbContext.Set<TEntity>().Attach(entityToUpdate);
            }
            dbContext.Entry(entityToUpdate).State = EntityState.Modified;
        }

        public int Save()
        {
            return dbContext.SaveChanges();
        }

        public Task<int> SaveAsync()
        {
            return dbContext.SaveChangesAsync();
        }
    }
}
