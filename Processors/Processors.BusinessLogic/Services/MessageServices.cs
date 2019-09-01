using Newtonsoft.Json;
using Processors.BusinessLogic.Interfaces;
using Processors.DataAccess.Interfaces;
using Processors.Domain;
using Processors.Domain.DTO;
using Services.Interfaces;
using Services.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Processors.BusinessLogic.ImageComparer;
using RabbitMQ.Client.Events;
using Services.Implementation.RabbitMq;

namespace Processors.BusinessLogic.Services
{
    public class MessageServices : IMessageService
    {
        private readonly IImageProcessingService _imageProcessingService;

        private readonly IElasticStorage _elasticStorage;
        private readonly IPhotoBlobStorage _photoBlobStore;
        private readonly IProducer _producer;
        private readonly IConsumer _consumer;
        private readonly ICognitiveService _cognitiveService;
        private readonly ImageCompareService _comparer;

        // CONSTRUCTORS
        public MessageServices(IImageProcessingService imageProcessingService, ICognitiveService cognitiveService,
            IElasticStorage elasticStorage, IPhotoBlobStorage photoBlobStore, IConsumer consumer, IProducer producer, ImageCompareService comparer)
        {
            _imageProcessingService = imageProcessingService;
            _cognitiveService = cognitiveService;
            _elasticStorage = elasticStorage;
            _photoBlobStore = photoBlobStore;
            _producer = producer;
            _consumer = consumer;
            _comparer = comparer;
        }

        public void Dispose()
        {
            _consumer?.Dispose();
        }

        public async Task RunAsync(int millisecondsTimeout)
        {
            Console.WriteLine("running");
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
            var hash = new ImgHash((int)makePhotoThumbnailDTO.ImageId, _elasticStorage);
            hash.GenerateFromByteArray(currentImg);
            await _elasticStorage.UpdateHashAsync(makePhotoThumbnailDTO.ImageId, new HasDTO { Hash = new List<bool>(hash.HashData) });
            var comparison_result = await _comparer.FindDuplicatesWithTollerance(1);
            var isDuplicate = false;
            foreach (var item in comparison_result)
            {
                if (item.Count <= 1) continue;
                foreach (var itm in item)
                {
                    if (itm.PhotoId == makePhotoThumbnailDTO.ImageId)
                    {
                        isDuplicate = true;
                    } 
                }
            }

            var bytes = BitConverter.GetBytes(isDuplicate);
            _producer.Send(bytes);

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
