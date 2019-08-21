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
        public async Task<string> LoadPhotoToBlob(byte[] blob, string name = null)
        {
            var directories = ImageMetadataReader.ReadMetadata(new MemoryStream(blob));
            if (name == null)
            {
                name = Guid.NewGuid().ToString();
            }
            else
            {
                name = Path.GetFileNameWithoutExtension(name);
            }
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
        public async Task<List<Byte[]>> GetPhotos(PhotoDocument[] values)
        {
            List<Byte[]> list = new List<Byte[]>();
            foreach(var item in values)
            {
                var folderName = "images/";
                var index = item.OriginalBlobId.IndexOf(folderName);
                var text = item.OriginalBlobId.Substring(index + folderName.Length);
                CloudBlockBlob cloudBlob = cloudBlobContainerPhotos.GetBlockBlobReference(text);

                await cloudBlob.FetchAttributesAsync();
                long fileByteLength = cloudBlob.Properties.Length;
                Byte[] myByteArray = new Byte[fileByteLength];
                await cloudBlob.DownloadToByteArrayAsync(myByteArray, 0);
                list.Add(myByteArray);
            }
            return list;
        }

        public async Task<string> GetPhoto(string blobId)
        {
           
            CloudBlockBlob cloudBlob = cloudBlobContainerPhotos.GetBlockBlobReference(blobId);
            var type = Path.GetExtension(blobId);
            await cloudBlob.FetchAttributesAsync();
            long fileByteLength = cloudBlob.Properties.Length;
            Byte[] myByteArray = new Byte[fileByteLength];
            await cloudBlob.DownloadToByteArrayAsync(myByteArray, 0);
            string base64 = Convert.ToBase64String(myByteArray);
            return $"data:image/{type.Substring(1)};base64,{base64}";
        }

        public async Task<string> LoadAvatarToBlob(byte[] blob)
        {
            CloudBlockBlob cloudBlockBlob = cloudBlobContainerAvatars.GetBlockBlobReference(Guid.NewGuid().ToString() + ".jpg");
            var directories = ImageMetadataReader.ReadMetadata(new MemoryStream(blob));
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
            cloudBlockBlob.Properties.ContentType = contentType;
            await cloudBlockBlob.UploadFromByteArrayAsync(blob, 0, blob.Length);
            return $"{cloudBlockBlob.Container.Name}/{Path.GetFileName(cloudBlockBlob.Uri.ToString())}";
        }

        public async Task DeleteFileAsync(string blobName)
        {
            CloudBlockBlob blob = this.cloudBlobContainerPhotos.GetBlockBlobReference(blobName);
            await blob.DeleteIfExistsAsync();
        }
    }
}
