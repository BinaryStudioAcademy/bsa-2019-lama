using System.Linq;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Microsoft.EntityFrameworkCore;

namespace Lama.BusinessLogic.Services
{
    public class UserProtectionService: IUserProtectionService
    {
        private readonly ApplicationDbContext _dbContext;

        public UserProtectionService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public int GetCurrentUserId(string email)
        {
            var currentUser = _dbContext.Users.FirstOrDefault(user => user.Email == email);
            if (currentUser != null)
            {
                return currentUser.Id;
            }
            return -1;
        }
    }
}