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
   

        public async Task LoadPhotosToBlob(string[] photos)
        {
            string[] valid_base64 = new string[photos.Length];
            for (int i = 0; i < photos.Length; i++)
            {
                valid_base64[i] = photos[i].Replace("data:image/jpeg;base64,", String.Empty).Replace("-", "+").Replace("_", "/");
            }
            byte[][] blobs = new byte[photos.Length][];
            for (int i=0; i<photos.Length; i++)
            {
                blobs[i] = System.Convert.FromBase64String(valid_base64[i]);
                CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(Guid.NewGuid().ToString() + ".jpg");
                using (var stream = new MemoryStream(blobs[i], writable: false))
                {
                    await cloudBlockBlob.UploadFromStreamAsync(stream);
                }
            }
        }
    }
}
