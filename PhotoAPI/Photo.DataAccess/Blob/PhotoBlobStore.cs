using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using Photo.DataAccess.Interfaces;
using Photo.Domain.BlobModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;


namespace Photo.DataAccess.Blob
{
    public class PhotoBlobStore : IPhotoBlobStorage
    {
        // FIELDS
        private CloudBlobContainer cloudBlobContainerPhotos;
        private CloudBlobContainer cloudBlobContainerAvatars;

        // CONSTRUCTORS
        public PhotoBlobStore(string storageConnectionString)
        {
            if (CloudStorageAccount.TryParse(storageConnectionString, out CloudStorageAccount storageAccount))
            {
                CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();

                cloudBlobContainerPhotos = cloudBlobClient.GetContainerReference("images");
                cloudBlobContainerAvatars = cloudBlobClient.GetContainerReference("avatars");

                cloudBlobContainerPhotos.CreateIfNotExists();
                cloudBlobContainerAvatars.CreateIfNotExists();

            BlobContainerPermissions permissions = new BlobContainerPermissions
            {
                PublicAccess = BlobContainerPublicAccessType.Blob
            };

                cloudBlobContainerPhotos.SetPermissionsAsync(permissions);
                cloudBlobContainerAvatars.SetPermissionsAsync(permissions);
            }
        }
        public async Task<List<Byte[]>> GetPhotos(PhotoDocument[] values)
        {
            List<Byte[]> list = new List<Byte[]>(); 

            for (int i = 0; i < values.Length; i++)
            {
                    var folderName = "images/";
                    var index = values[i].OriginalBlobId.IndexOf(folderName);
                    var text = values[i].OriginalBlobId.Substring(index+folderName.Length);
                    CloudBlockBlob cloudBlob = cloudBlobContainerPhotos.GetBlockBlobReference(text);

                    await cloudBlob.FetchAttributesAsync();
                    long fileByteLength = cloudBlob.Properties.Length;
                    Byte[] myByteArray = new Byte[fileByteLength];
                    await cloudBlob.DownloadToByteArrayAsync(myByteArray, 0);
                    list.Add(myByteArray);
            }
            return list;
        }
        // METHODS
        public async Task<string> LoadPhotoToBlob(byte[] blob)
        {
            string blobName = Guid.NewGuid().ToString() + ".jpg";

            CloudBlockBlob cloudBlockBlob = cloudBlobContainerPhotos.GetBlockBlobReference(blobName);
            cloudBlockBlob.Properties.ContentType = "image/jpg";
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);          

            return cloudBlockBlob.Uri.ToString();
        }

        public async Task<string> LoadAvatarToBlob(byte[] blob)
        {
            CloudBlockBlob cloudBlockBlob = cloudBlobContainerAvatars.GetBlockBlobReference(Guid.NewGuid().ToString() + ".jpg");
            cloudBlockBlob.Properties.ContentType = "image/jpg";
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);
            return cloudBlockBlob.Uri.ToString();
        }

        public async Task DeleteFileAsync(string blobName)
        {
            CloudBlockBlob blob = this.cloudBlobContainerPhotos.GetBlockBlobReference(blobName);
            await blob.DeleteIfExistsAsync();
        }
    }
}
