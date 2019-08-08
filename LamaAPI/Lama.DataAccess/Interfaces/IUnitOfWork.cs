namespace Lama.DataAccess.Interfaces
{
    public interface IUnitOfWork
    {
        IRepository<TEntity> GetRepository<TEntity>()
            where TEntity : class;

        void Update<TEntity>(TEntity entityToUpdate) where TEntity : class;

        int Save();
        System.Threading.Tasks.Task<int> SaveAsync();
    }
}
