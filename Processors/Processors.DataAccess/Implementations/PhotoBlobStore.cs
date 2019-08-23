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
        private readonly CloudBlobContainer _cloudBlobContainerPhotos;
        private readonly CloudBlobContainer _cloudBlobContainerAvatars;

        
        public PhotoBlobStore(CreateBlobStorageSettings settings)
        {
            var cloudStorageAccount = CloudStorageAccount.Parse(settings.ConnectionString);

            var cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();

            #region CORS
            var blobServiceProperties = cloudBlobClient.GetServiceProperties();

            ConfigureCors(blobServiceProperties, settings.AllowedOrigins);

            cloudBlobClient.SetServiceProperties(blobServiceProperties);
            #endregion

            _cloudBlobContainerPhotos = cloudBlobClient.GetContainerReference(settings.ImageContainerName);
            _cloudBlobContainerAvatars = cloudBlobClient.GetContainerReference(settings.AvatarsContainerName);

            _cloudBlobContainerPhotos.CreateIfNotExists();
            _cloudBlobContainerAvatars.CreateIfNotExists();

            var permissions = new BlobContainerPermissions
            {
                PublicAccess = BlobContainerPublicAccessType.Blob
            };

            _cloudBlobContainerPhotos.SetPermissionsAsync(permissions);
            _cloudBlobContainerAvatars.SetPermissionsAsync(permissions);
        }

        private static void ConfigureCors(ServiceProperties serviceProperties, IList<string> allowedOrigins)
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

        public async Task<string> LoadPhotoToBlob(byte[] blob)
        {
            var directories = ImageMetadataReader.ReadMetadata(new MemoryStream(blob));
            var name = Guid.NewGuid().ToString();
            var contentType = "image/jpg";
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
            var cloudBlockBlob = _cloudBlobContainerPhotos.GetBlockBlobReference($"{name}.{Path.GetFileName(contentType)}");
            cloudBlockBlob.Properties.ContentType = contentType;
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);
            return $"{cloudBlockBlob.Container.Name}/{Path.GetFileName(cloudBlockBlob.Uri.ToString())}";
        }

        public async Task<string> LoadAvatarToBlob(byte[] blob)
        {
            var directories = ImageMetadataReader.ReadMetadata(new MemoryStream(blob));
            var name = Guid.NewGuid().ToString();
            var contentType = "image/jpg";
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
            var cloudBlockBlob = _cloudBlobContainerAvatars.GetBlockBlobReference($"{name}.{Path.GetFileName(contentType)}");
            cloudBlockBlob.Properties.ContentType = contentType;
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);
            return $"{cloudBlockBlob.Container.Name}/{Path.GetFileName(cloudBlockBlob.Uri.ToString())}";
        }
        
        public async Task<byte[]> GetPhoto(string fileName)
        {
            CloudBlob cloudBlob = _cloudBlobContainerPhotos.GetBlockBlobReference(fileName);

            await cloudBlob.FetchAttributesAsync();
            var fileByteLength = cloudBlob.Properties.Length;

            var byteArray = new byte[fileByteLength];
            await cloudBlob.DownloadToByteArrayAsync(byteArray, 0);

            return byteArray;
        }

        public async Task<byte[]> GetAvatar(string fileName)
        {
            CloudBlob cloudBlob = _cloudBlobContainerAvatars.GetBlockBlobReference(fileName);

            await cloudBlob.FetchAttributesAsync();
            var fileByteLength = cloudBlob.Properties.Length;

            var byteArray = new byte[fileByteLength];
            await cloudBlob.DownloadToByteArrayAsync(byteArray, 0);

            return byteArray;
        }
    }
}
