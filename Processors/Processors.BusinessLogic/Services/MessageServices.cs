using Newtonsoft.Json;
using Processors.BusinessLogic.Interfaces;
using Processors.DataAccess.Interfaces;
using Processors.Domain;
using Processors.Domain.DTO;
using Services.Interfaces;
using Services.Models;
using System;
using System.Threading.Tasks;
using Processors.BusinessLogic.ImageComparer;

namespace Processors.BusinessLogic.Services
{
    public class MessageServices : IMessageService
    {
        private readonly IImageProcessingService _imageProcessingService;

        private readonly IElasticStorage _elasticStorage;
        private readonly IPhotoBlobStorage _photoBlobStore;

        private readonly IConsumer _consumer;
        private readonly ICognitiveService _cognitiveService;

        // CONSTRUCTORS
        public MessageServices(IImageProcessingService imageProcessingService, ICognitiveService cognitiveService, IElasticStorage elasticStorage, IPhotoBlobStorage photoBlobStore, IConsumer consumer)
        {
            _imageProcessingService = imageProcessingService;
            _cognitiveService = cognitiveService;

            _elasticStorage = elasticStorage;
            _photoBlobStore = photoBlobStore;

            _consumer = consumer;
        }

        public void Dispose()
        {
            _consumer?.Dispose();
        }

        public async Task RunAsync(int millisecondsTimeout)
        {
            while (true)
            {
                var receiveData = _consumer.Receive(millisecondsTimeout);

                if (receiveData == null) continue;
                await HandleReceivedDataAsync(JsonConvert.DeserializeObject<MakePhotoThumbnailDTO>(receiveData.Message));
                _consumer.SetAcknowledge(receiveData.DeliveryTag, true);
            }

        }
        private async Task HandleReceivedDataAsync(MakePhotoThumbnailDTO makePhotoThumbnailDTO)
        {
            string address;
            try
            {
                address = await _elasticStorage.GetBlobId(makePhotoThumbnailDTO.ImageId);
            }catch(Exception) // FIX
            {
                return;
            }
            var fileName = address.Substring(address.LastIndexOf('/') + 1);
            var currentImg = await GetImage(makePhotoThumbnailDTO.ImageType, fileName);

            var image64 = _imageProcessingService.CreateThumbnail(currentImg, 64);
            var image256 = _imageProcessingService.CreateThumbnail(currentImg, 256);
            var imageTags = await _cognitiveService.ProcessImageTags(currentImg);
            var imageTagsAsRawString = JsonConvert.SerializeObject(imageTags);
            new ImgHash((int)makePhotoThumbnailDTO.ImageId, _elasticStorage).GenerateFromByteArray(currentImg);

            if (await _elasticStorage.ExistAsync(makePhotoThumbnailDTO.ImageId))
            {
                var thumbnailUpdateDTO = await LoadImageToBlob(makePhotoThumbnailDTO.ImageType, image64, image256);
                var imageTagsAsRaw = new ImageTagsAsRaw{Tags = imageTagsAsRawString};

                await _elasticStorage.UpdateImageTagsAsync(makePhotoThumbnailDTO.ImageId, imageTagsAsRaw);
                await _elasticStorage.UpdateThumbnailsAsync(makePhotoThumbnailDTO.ImageId, thumbnailUpdateDTO);
            }
        }
        private async Task<byte[]> GetImage(ImageType imageType, string fileName)
        {
            switch (imageType)
            {
                case ImageType.Photo: return await _photoBlobStore.GetPhoto(fileName);
                case ImageType.Avatar: return await _photoBlobStore.GetAvatar(fileName);

                default: throw new System.ArgumentException("Unexpected image type");
            }
        }
        private async Task<ThumbnailUpdateDTO> LoadImageToBlob(ImageType imageType, byte[] image64, byte[] image256)
        {
            switch (imageType)
            {
                case ImageType.Avatar:
                    return new ThumbnailUpdateDTO
                    {
                        Blob64Id = await _photoBlobStore.LoadAvatarToBlob(image64),
                        Blob256Id = await _photoBlobStore.LoadAvatarToBlob(image256),
                    };
                case ImageType.Photo:
                    return new ThumbnailUpdateDTO
                    {
                        Blob64Id = await _photoBlobStore.LoadPhotoToBlob(image64),
                        Blob256Id = await _photoBlobStore.LoadPhotoToBlob(image256),
                    };
                default:
                    throw new ArgumentException("Unexpected image type");
            }
        }
    }
}
