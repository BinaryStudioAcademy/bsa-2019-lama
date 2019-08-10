using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;

using System;
using System.Threading.Tasks;


namespace Photo.DataAccess.Blob
{
    public class PhotoBlobStore : Interfaces.IPhotoBlobStorage
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
        
        // METHODS
        public async Task<string> LoadPhotoToBlob(byte[] blob)
        {
            string blobName = Guid.NewGuid().ToString() + ".jpg";

            CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(blobName);
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
        public async Task DeleteFileAsync(string blobName)
        {
            CloudBlockBlob blob = this.cloudBlobContainer.GetBlockBlobReference(blobName);
            await blob.DeleteIfExistsAsync();
        }
    }
}
