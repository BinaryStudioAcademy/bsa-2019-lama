using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;


namespace Photo.DataAccess.Blob
{
    public class PhotoBlobStore
    {
        //AppConfiguration config = new AppConfiguration();
        string storageConnectionString = "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;";
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
            byte[] blob;
            blob = System.Convert.FromBase64String(photo);
            CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(Guid.NewGuid().ToString() + ".jpg");
            cloudBlockBlob.Properties.ContentType = "image/jpg";
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);
            return cloudBlockBlob.Uri.ToString();
        }

    }
}
