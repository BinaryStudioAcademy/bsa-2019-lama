using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;


namespace Photo.DataAccess.Blob
{
    public class PhotoBlobStore
    {
        string storageConnectionString;
        public PhotoBlobStore(IConfiguration configuration)
        {
            storageConnectionString = configuration.GetSection("Storage").Value;
        }
        //AppConfiguration config = new AppConfiguration();
        private CloudBlobContainer cloudBlobContainer;

        public PhotoBlobStore()
        {
            CloudStorageAccount storageAccount;
            if (CloudStorageAccount.TryParse(storageConnectionString, out storageAccount))
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
        // Check whether the connection string can be parsed.
  

        public async Task<string> LoadPhotoToBlob(string photo)
        {
            byte[] blob = System.Convert.FromBase64String(photo);
            CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(Guid.NewGuid().ToString() + ".jpg");
            cloudBlockBlob.Properties.ContentType = "image/jpg";
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);
            return cloudBlockBlob.Uri.ToString();
        }

    }
}
