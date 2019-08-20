using Photo.Domain.BlobModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Photo.DataAccess.Interfaces
{
    public interface IPhotoBlobStorage
    {
        Task<string> LoadPhotoToBlob(byte[] blob, string name = null);
        Task<string> LoadAvatarToBlob(byte[] blob);
        Task DeleteFileAsync(string blobName);
        Task<List<Byte[]>> GetPhotos(PhotoDocument[] values);
        Task<string> GetPhoto(string value);
    }
}
