using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IUserProtectionService
    {
        int GetCurrentUserId(string email);
    }
}