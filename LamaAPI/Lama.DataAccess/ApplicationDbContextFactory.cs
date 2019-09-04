using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Lama.DataAccess
{
    public class ApplicationDbContextFactory: IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseSqlServer("Server=(local);Database=LamaDB;Trusted_Connection=True;ConnectRetryCount=0");
            
            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}