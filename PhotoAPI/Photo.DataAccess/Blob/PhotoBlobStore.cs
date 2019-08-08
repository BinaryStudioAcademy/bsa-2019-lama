using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;

using System;
using System.Threading.Tasks;


namespace Photo.DataAccess.Blob
{
    public class PhotoBlobStore : Interfaces.IPhotoBlobStorage
    {
        // FIELDS
        private CloudBlobContainer cloudBlobContainer;

        // CONSTRUCTORS
        public PhotoBlobStore(string storageConnectionString)
        {
            if (CloudStorageAccount.TryParse(storageConnectionString, out CloudStorageAccount storageAccount))
            {
                CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();

                cloudBlobContainer = cloudBlobClient.GetContainerReference("images");

                cloudBlobContainer.CreateIfNotExists();

                BlobContainerPermissions permissions = new BlobContainerPermissions
                {
                    PublicAccess = BlobContainerPublicAccessType.Blob
                };

                cloudBlobContainer.SetPermissionsAsync(permissions);
            }
        }

        // METHODS
        public async Task<string> LoadPhotoToBlob(byte[] blob)
        {
            CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(Guid.NewGuid().ToString() + ".jpg");
            cloudBlockBlob.Properties.ContentType = "image/jpg";
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);
            return cloudBlockBlob.Uri.ToString();
        }        
    }
}
