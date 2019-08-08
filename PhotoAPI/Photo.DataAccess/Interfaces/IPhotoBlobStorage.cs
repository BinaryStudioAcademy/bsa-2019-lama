namespace Photo.DataAccess.Interfaces
{
    public interface IPhotoBlobStorage
    {
        System.Threading.Tasks.Task<string> LoadPhotoToBlob(byte[] blob);
    }
}
