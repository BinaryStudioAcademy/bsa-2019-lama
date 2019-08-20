using Newtonsoft.Json;
using Processors.BusinessLogic.Interfaces;
using Processors.DataAccess.Interfaces;
using Processors.Domain;
using Processors.Domain.DTO;
using Services.Interfaces;
using Services.Models;
using System.Threading.Tasks;

namespace Processors.BusinessLogic.Services
{
    public class MessageServices : IMessageService
    {
        // FIELDS
        IImageProcessingService imageProcessingService;

        IElasticStorage elasticStorage;
        IPhotoBlobStorage photoBlobStore;

        IConsumer consumer;

        // CONSTRUCTORS
        public MessageServices(IImageProcessingService imageProcessingService, IElasticStorage elasticStorage, IPhotoBlobStorage photoBlobStore, IConsumer consumer)
        {
            this.imageProcessingService = imageProcessingService;

            this.elasticStorage = elasticStorage;
            this.photoBlobStore = photoBlobStore;

            this.consumer = consumer;
        }

        public void Dispose()
        {
            consumer?.Dispose();
        }

        // METHODS
        public async Task RunAsync(int millisecondsTimeout)
        {
            while (true)
            {
                ReceiveData receiveData = consumer.Receive(millisecondsTimeout);

                if (receiveData != null)
                {
                    await HandleReceivedDataAsync(JsonConvert.DeserializeObject<MakePhotoThumbnailDTO>(receiveData.Message));
                    consumer.SetAcknowledge(receiveData.DeliveryTag, true);
                }
            }

        }
        private async Task HandleReceivedDataAsync(MakePhotoThumbnailDTO makePhotoThumbnailDTO)
        {
            // get image
            string address = await elasticStorage.GetBlobId(makePhotoThumbnailDTO.ImageId);
            string fileName = address.Substring(address.LastIndexOf('/') + 1);
            byte[] currentImg = await GetImage(makePhotoThumbnailDTO.ImageType, fileName);

            // create thumbnails
            byte[] image64 = imageProcessingService.CreateThumbnail(currentImg, 64);
            byte[] image256 = imageProcessingService.CreateThumbnail(currentImg, 256);

            // load blobs and update elastic only if
            // document still exist
            if (await elasticStorage.ExistAsync(makePhotoThumbnailDTO.ImageId))
            {
                ThubnailUpdateDTO thubnailUpdateDTO = await LoadImageToBlob(makePhotoThumbnailDTO.ImageType, image64, image256);

                await elasticStorage.UpdateThumbnailsAsync(makePhotoThumbnailDTO.ImageId, thubnailUpdateDTO);
            }
        }
        private async Task<byte[]> GetImage(ImageType imageType, string fileName)
        {
            switch (imageType)
            {
                case ImageType.Photo: return await photoBlobStore.GetPhoto(fileName);
                case ImageType.Avatar: return await photoBlobStore.GetAvatar(fileName);

                default: throw new System.ArgumentException("Unexpected image type");
            }
        }
        private async Task<ThubnailUpdateDTO> LoadImageToBlob(ImageType imageType, byte[] image64, byte[] image256)
        {
            if (ImageType.Avatar == imageType)
            {
                return new ThubnailUpdateDTO
                {
                    Blob64Id = await photoBlobStore.LoadAvatarToBlob(image64),
                    Blob256Id = await photoBlobStore.LoadAvatarToBlob(image256),
                };
            }
            else if (ImageType.Photo == imageType)
            {
                return new ThubnailUpdateDTO
                {
                    Blob64Id = await photoBlobStore.LoadPhotoToBlob(image64),
                    Blob256Id = await photoBlobStore.LoadPhotoToBlob(image256),
                };
            }
            else throw new System.ArgumentException("Unexpected image type");
        }
    }
}
