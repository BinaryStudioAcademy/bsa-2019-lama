using System.Threading.Tasks;

namespace Processors.DataAccess.Interfaces
{
    public interface IPhotoBlobStorage
    {
        Task<string> LoadPhotoToBlob(byte[] blob);
        Task<string> LoadAvatarToBlob(byte[] blob);

        Task<byte[]> GetPhoto(string fileName);
        Task<byte[]> GetAvatar(string fileName);
    }
}
