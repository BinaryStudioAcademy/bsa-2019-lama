using Newtonsoft.Json;
using Processors.BusinessLogic.Interfaces;
using Processors.DataAccess.Interfaces;
using Processors.Domain;
using Processors.Domain.DTO;
using Services.Interfaces;
using Services.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
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
                await HandleReceivedDataAsync(JsonConvert.DeserializeObject<List<ImageToProcessDTO>>(receiveData.Message));
                _consumer.SetAcknowledge(receiveData.DeliveryTag, true);
            }
        }


        private async Task HandleReceivedDataAsync(IEnumerable<ImageToProcessDTO> images)
        {
            foreach (var image in images)
            {
                var address = await _elasticStorage.GetBlobId(image.ImageId);
                var fileName = address.Substring(address.LastIndexOf('/') + 1);
                var currentImg = await GetImage(image.ImageType, fileName);
                var image64 = _imageProcessingService.CreateThumbnail(currentImg, 64);
                var image256 = _imageProcessingService.CreateThumbnail(currentImg, 256);
                var blob = await LoadImageToBlob(ImageType.Photo, image64, image256);
                var imageTags = await _cognitiveService.ProcessImageTags(currentImg);
                var imageTagsAsRawString = JsonConvert.SerializeObject(imageTags);
                var hash = new ImgHash((int) image.ImageId, _elasticStorage);
                hash.GenerateFromByteArray(currentImg);
                await _elasticStorage.UpdateThumbnailsAsync(image.ImageId, blob);
                await _elasticStorage.UpdateImageTagsAsync(image.ImageId, new ImageTagsAsRaw
                {
                    Tags = imageTagsAsRawString
                });
                await _elasticStorage.UpdateHashAsync(image.ImageId, new HasDTO {Hash = new List<bool>(hash.HashData)});
            }
            var duplicates = new List<int>();
            var comparison_result = await _comparer.FindDuplicatesWithTollerance(1);
            foreach (var item in images)
            {
                foreach (var result in comparison_result)
                {
                    if (result.Count <= 1) continue;

                    foreach (var itm in result)
                    {
                        if (itm.PhotoId == item.ImageId)
                        {
                            duplicates.Add((int)item.ImageId);
                            break;
                        }
                    }
                }
            }

            var bytes = duplicates.SelectMany(BitConverter.GetBytes).ToArray();
            //var bytes = BitConverter.GetBytes(duplicates);
            _producer.Send(bytes);
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
