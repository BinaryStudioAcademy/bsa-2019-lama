using MetadataExtractor;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using Microsoft.Azure.Storage.Shared.Protocol;

using Processors.Domain.Settings;

using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Processors.DataAccess.Implementation
{
    public class PhotoBlobStore : Interfaces.IPhotoBlobStorage
    {
        // FIELDS
        private CloudBlobContainer cloudBlobContainerPhotos;
        private CloudBlobContainer cloudBlobContainerAvatars;

        // CONSTRUCTORS
        public PhotoBlobStore(CreateBlobStorageSettings settings)
        {
            CloudStorageAccount cloudStorageAccount = CloudStorageAccount.Parse(settings.ConnectionString);

            CloudBlobClient cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();

            #region CORS
            ServiceProperties blobServiceProperties = cloudBlobClient.GetServiceProperties();

            // Enable and Configure CORS
            ConfigureCors(blobServiceProperties, settings.AllowedOrigins);

            // Commit the CORS changes into the Service Properties
            cloudBlobClient.SetServiceProperties(blobServiceProperties);
            #endregion

            cloudBlobContainerPhotos = cloudBlobClient.GetContainerReference(settings.ImageContainerName);
            cloudBlobContainerAvatars = cloudBlobClient.GetContainerReference(settings.AvatarsContainerName);

            cloudBlobContainerPhotos.CreateIfNotExists();
            cloudBlobContainerAvatars.CreateIfNotExists();

            BlobContainerPermissions permissions = new BlobContainerPermissions
            {
                PublicAccess = BlobContainerPublicAccessType.Blob
            };

            cloudBlobContainerPhotos.SetPermissionsAsync(permissions);
            cloudBlobContainerAvatars.SetPermissionsAsync(permissions);
        }

        private void ConfigureCors(ServiceProperties serviceProperties, IList<string> allowedOrigins)
        {
            serviceProperties.Cors = new CorsProperties();
            serviceProperties.Cors.CorsRules.Add(new CorsRule()
            {
                AllowedHeaders = new List<string>() { "*" },
                AllowedMethods = CorsHttpMethods.Put | CorsHttpMethods.Get | CorsHttpMethods.Head | CorsHttpMethods.Post | CorsHttpMethods.Delete,
                AllowedOrigins = allowedOrigins,
                ExposedHeaders = new List<string>() { "*" },
                MaxAgeInSeconds = 1800 // 30 minutes
            });
        }

        // METHODS
        public async Task<string> LoadPhotoToBlob(byte[] blob)
        {
            var directories = ImageMetadataReader.ReadMetadata(new MemoryStream(blob));
            var name = Guid.NewGuid().ToString();
            string contentType = "image/jpg";
            foreach (var directory in directories)
            {
                foreach (var tag in directory.Tags)
                {
                    if (tag.Name == "Detected MIME Type")
                    {
                        contentType = tag.Description;
                    }
                }
            }
            CloudBlockBlob cloudBlockBlob = cloudBlobContainerPhotos.GetBlockBlobReference($"{name}.{Path.GetFileName(contentType)}");
            cloudBlockBlob.Properties.ContentType = contentType;
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);
            return $"{cloudBlockBlob.Container.Name}/{Path.GetFileName(cloudBlockBlob.Uri.ToString())}";
        }

        public async Task<string> LoadAvatarToBlob(byte[] blob)
        {
            var directories = ImageMetadataReader.ReadMetadata(new MemoryStream(blob));
            var name = Guid.NewGuid().ToString();
            string contentType = "image/jpg";
            foreach (var directory in directories)
            {
                foreach (var tag in directory.Tags)
                {
                    if (tag.Name == "Detected MIME Type")
                    {
                        contentType = tag.Description;
                    }
                }
            }
            CloudBlockBlob cloudBlockBlob = cloudBlobContainerAvatars.GetBlockBlobReference($"{name}.{Path.GetFileName(contentType)}");
            cloudBlockBlob.Properties.ContentType = contentType;
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);
            return $"{cloudBlockBlob.Container.Name}/{Path.GetFileName(cloudBlockBlob.Uri.ToString())}";
        }
        
        public async Task<byte[]> GetPhoto(string fileName)
        {
            CloudBlob cloudBlob = cloudBlobContainerPhotos.GetBlockBlobReference(fileName);

            await cloudBlob.FetchAttributesAsync();
            long fileByteLength = cloudBlob.Properties.Length;

            byte[] byteArray = new byte[fileByteLength];
            await cloudBlob.DownloadToByteArrayAsync(byteArray, 0);

            return byteArray;
        }

        public async Task<byte[]> GetAvatar(string fileName)
        {
            CloudBlob cloudBlob = cloudBlobContainerAvatars.GetBlockBlobReference(fileName);

            await cloudBlob.FetchAttributesAsync();
            long fileByteLength = cloudBlob.Properties.Length;

            byte[] byteArray = new byte[fileByteLength];
            await cloudBlob.DownloadToByteArrayAsync(byteArray, 0);

            return byteArray;
        }
    }
}
