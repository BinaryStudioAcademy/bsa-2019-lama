﻿using System.Threading.Tasks;

namespace Photo.DataAccess.Interfaces
{
    public interface IPhotoBlobStorage
    {
        Task<string> LoadPhotoToBlob(byte[] blob, string filename);
        Task<string> LoadAvatarToBlob(byte[] blob);
        Task DeleteFileAsync(string blobName);
    }
}
