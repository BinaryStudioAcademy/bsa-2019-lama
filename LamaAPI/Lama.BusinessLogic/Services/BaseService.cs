using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Services
{
    public abstract class BaseService<T> : IBaseService<T> where T : class
    {
        protected ApplicationDbContext Context;

        public BaseService(ApplicationDbContext Context)
        {
            this.Context = Context;
        }
        public virtual async Task<int> Create(T item)
        {
            await Context.Set<T>().AddAsync(item);
            return await Context.SaveChangesAsync();
        }

        public virtual async Task<int> Delete(T entity)
        {
            Context.Set<T>().Remove(entity);
            return await Context.SaveChangesAsync();
        }

        public virtual async Task<IEnumerable<T>> FindAll()
        {
            return await Context.Set<T>().AsNoTracking().ToListAsync();
        }

        public virtual async Task<T> Update(T t, object key)
        {
            if (t == null)
                return null;
            T exist = await Context.Set<T>().FindAsync(key);
            if (exist != null)
            {
                Context.Entry(exist).CurrentValues.SetValues(t);
                await Context.SaveChangesAsync();
            }
            return exist;
        }
    }
}