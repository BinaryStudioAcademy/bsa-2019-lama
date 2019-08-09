using System.Threading.Tasks;

namespace Photo.DataAccess.Interfaces
{
    public interface IPhotoBlobStorage
    {
        Task<string> LoadPhotoToBlob(byte[] blob);
        Task DeleteFileAsync(string blobName);
    }
}
