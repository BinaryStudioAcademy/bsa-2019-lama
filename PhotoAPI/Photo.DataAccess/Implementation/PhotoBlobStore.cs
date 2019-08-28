using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using Microsoft.Azure.Storage.Shared.Protocol;
using Photo.DataAccess.Interfaces;
using Photo.Domain.BlobModels;
using Photo.Domain.Settings;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MetadataExtractor;
using System.IO;
using System.Drawing;

namespace Photo.DataAccess.Implementation
{
    public class PhotoBlobStore : IPhotoBlobStorage
    {
        private readonly CloudBlobContainer _cloudBlobContainerPhotos;
        private readonly CloudBlobContainer _cloudBlobContainerAvatars;

        // CONSTRUCTORS
        public PhotoBlobStore(CreateBlobStorageSettings settings)
        {
            var cloudStorageAccount = CloudStorageAccount.Parse(settings.ConnectionString);

            var cloudBlobClient = cloudStorageAccount.CreateCloudBlobClient();

            #region CORS
            ServiceProperties blobServiceProperties = cloudBlobClient.GetServiceProperties();

            // Enable and Configure CORS
            ConfigureCors(blobServiceProperties, settings.AllowedOrigins);

            // Commit the CORS changes into the Service Properties
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
        public async Task<string> LoadPhotoToBlob(byte[] blob, string name = null)
        {
            var directories = ImageMetadataReader.ReadMetadata(new MemoryStream(blob));
            name = name == null ? Guid.NewGuid().ToString() : Path.GetFileNameWithoutExtension(name);
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
        public async Task<List<byte[]>> GetPhotos(PhotoDocument[] values)
        {
            var list = new List<byte[]>();
            foreach(var item in values)
            {
                var folderName = "images/";
                var index = item.OriginalBlobId.IndexOf(folderName);
                var text = item.OriginalBlobId.Substring(index + folderName.Length);
                var cloudBlob = _cloudBlobContainerPhotos.GetBlockBlobReference(text);

                await cloudBlob.FetchAttributesAsync();
                var fileByteLength = cloudBlob.Properties.Length;
                var myByteArray = new byte[fileByteLength];
                await cloudBlob.DownloadToByteArrayAsync(myByteArray, 0);
                list.Add(myByteArray);
            }
            return list;
        }

        public async Task<string> GetPhoto(string blobId)
        {
           
            var cloudBlob = _cloudBlobContainerPhotos.GetBlockBlobReference(blobId);
            var type = Path.GetExtension(blobId);
            await cloudBlob.FetchAttributesAsync();
            var fileByteLength = cloudBlob.Properties.Length;
            var myByteArray = new Byte[fileByteLength];
            await cloudBlob.DownloadToByteArrayAsync(myByteArray, 0);
            var base64 = Convert.ToBase64String(myByteArray);
            return $"data:image/{type.Substring(1)};base64,{base64}";
        }

        public async Task<string> GetAvatar(string blobId)
        {

            var cloudBlob = _cloudBlobContainerAvatars.GetBlockBlobReference(blobId);
            var type = Path.GetExtension(blobId);
            await cloudBlob.FetchAttributesAsync();
            var fileByteLength = cloudBlob.Properties.Length;
            var myByteArray = new byte[fileByteLength];
            await cloudBlob.DownloadToByteArrayAsync(myByteArray, 0);
            var base64 = Convert.ToBase64String(myByteArray);
            return $"data:image/{type.Substring(1)};base64,{base64}";
        }

        public async Task<string> LoadAvatarToBlob(byte[] blob)
        {
  
            var directories = ImageMetadataReader.ReadMetadata(new MemoryStream(blob));
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
            var cloudBlockBlob = _cloudBlobContainerAvatars.GetBlockBlobReference($"{Guid.NewGuid().ToString()}{Path.GetFileName(contentType)}");
            cloudBlockBlob.Properties.ContentType = contentType;
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);
            return $"{cloudBlockBlob.Container.Name}/{Path.GetFileName(cloudBlockBlob.Uri.ToString())}";
        }

        public async Task DeleteFileAsync(string blobName)
        {
            var blob = _cloudBlobContainerPhotos.GetBlockBlobReference(blobName);
            await blob.DeleteIfExistsAsync();
        }
    }
}
