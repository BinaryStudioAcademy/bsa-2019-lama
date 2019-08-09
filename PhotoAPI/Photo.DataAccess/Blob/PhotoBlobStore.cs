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
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(storageConnectionString);
            CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();
                
            cloudBlobContainer = cloudBlobClient.GetContainerReference("images");

            cloudBlobContainer.CreateIfNotExists();

            BlobContainerPermissions permissions = new BlobContainerPermissions
            {
                PublicAccess = BlobContainerPublicAccessType.Blob
            };

            cloudBlobContainer.SetPermissionsAsync(permissions);            
        }
        
        // METHODS
        public async Task<string> LoadPhotoToBlob(byte[] blob)
        {
            string blobName = Guid.NewGuid().ToString() + ".jpg";

            CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(blobName);
            cloudBlockBlob.Properties.ContentType = "image/jpg";
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);          

            return cloudBlockBlob.Uri.ToString();
        }

        public async Task DeleteFileAsync(string blobName)
        {
            CloudBlockBlob blob = this.cloudBlobContainer.GetBlockBlobReference(blobName);
            await blob.DeleteIfExistsAsync();
        }
    }
}
