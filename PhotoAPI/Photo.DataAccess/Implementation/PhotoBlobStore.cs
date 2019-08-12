﻿using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using Microsoft.Azure.Storage.Shared.Protocol;
using Photo.DataAccess.Interfaces;
using Photo.Domain.BlobModels;
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
        public async Task<string> LoadPhotoToBlob(byte[] blob, string filename)
        {
            var metadata = ImageMetadataReader.ReadMetadata(new MemoryStream(blob));
            string name = Guid.NewGuid().ToString();
            if (filename != null)
                name = filename;
            string blobName = name;

            CloudBlockBlob cloudBlockBlob = cloudBlobContainerPhotos.GetBlockBlobReference(blobName);
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
        }

        public async Task DeleteFileAsync(string blobName)
        {
            CloudBlockBlob blob = this.cloudBlobContainerPhotos.GetBlockBlobReference(blobName);
            await blob.DeleteIfExistsAsync();
        }
    }
}
