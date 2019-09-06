using Newtonsoft.Json;
using Processors.BusinessLogic.Interfaces;
using Processors.DataAccess.Interfaces;
using Processors.Domain;
using Processors.Domain.DTO;
using Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using RabbitMQ.Client.Events;
using Services.Models;
using Serilog;

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
        private readonly IProducer _categoryProducer;

        // CONSTRUCTORS
        public MessageServices(IImageProcessingService imageProcessingService, ICognitiveService cognitiveService,
            IElasticStorage elasticStorage, IPhotoBlobStorage photoBlobStore, IConsumer consumer, IProducer producer, IProducer categoryProducer, ImageCompareService comparer)
        {
            _imageProcessingService = imageProcessingService;
            _cognitiveService = cognitiveService;
            _elasticStorage = elasticStorage;
            _photoBlobStore = photoBlobStore;
            _producer = producer;
            _categoryProducer = categoryProducer;
            _consumer = consumer;
            _comparer = comparer;
            _consumer.Received += Get;
            _consumer.Connect();
            Log.Logger.Information("Processor messageService constructor");

        }

        public void Dispose()
        {
            _consumer?.Dispose();
            Log.Logger.Information("Consumer disposed(processor)");
        }

        public async void Get(object sender, BasicDeliverEventArgs args)
        {
			try
			{
				var message = Encoding.ASCII.GetString(args.Body);
				var obj = JsonConvert.DeserializeObject<List<ImageToProcessDTO>>(message);
				await HandleReceivedDataAsync(obj);
                Log.Logger.Information("Trying to set acknowlende (processor)");
				_consumer.SetAcknowledge(args.DeliveryTag, true);
                Log.Logger.Information("Anknowledge is set(processor)");
			}
			catch (Exception e)
			{
				Log.Logger.Error(e, "During processing message from the queue");
            }
        }

        public void Run()
        {
            Console.WriteLine("running");
        }

        private async Task HandleReceivedDataAsync(IEnumerable<ImageToProcessDTO> images)
        {
            Log.Logger.Information("Received photos");
            var imageToProcessDtos = images.ToList();
            foreach (var image in imageToProcessDtos)
            {
                var address = await _elasticStorage.GetBlobId(image.ImageId);
                var fileName = address.Substring(address.LastIndexOf('/') + 1);
                var currentImg = await GetImage(image.ImageType, fileName);
                var image64 = _imageProcessingService.CreateThumbnail(currentImg, 64);
                var image256 = _imageProcessingService.CreateThumbnail(currentImg, 256);
                var blob = await LoadImageToBlob(ImageType.Photo, image64, image256);
                var imageTags = await _cognitiveService.ProcessImageTags(currentImg);
                var imageCategory = await _cognitiveService.ProcessImageDescription(currentImg);
                var imageTagsAsRawString = JsonConvert.SerializeObject(imageTags);
                var hash = new ImgHash((int)image.ImageId);
                hash.GenerateFromByteArray(currentImg);
                await _elasticStorage.UpdateThumbnailsAsync(image.ImageId, blob);
                await _elasticStorage.UpdateImageTagsAsync(image.ImageId, new ImageTagsAsRaw
                {
                    Tags = imageTagsAsRawString
                });
                await _elasticStorage.UpdateImageDescriptionAsync(image.ImageId, new ImageDescriptionDTO
                {
                    Category = imageCategory
                });
                await _elasticStorage.UpdateHashAsync(image.ImageId,
                    new HashDTO { Hash = new List<bool>(hash.HashData)});
            }
            Log.Logger.Information("Updated hashes");
            await FindDuplicates(imageToProcessDtos);
            await SendImageCategories(imageToProcessDtos.Select(x => x.ImageId));
            Log.Logger.Information("Duplicates found");
        }

        private async Task SendImageCategories(IEnumerable<long> imageToProcessIds)
        {
            var dataToSend = new List<Tuple<int,long,string>>();
            foreach (var imageId in imageToProcessIds)
            {
                var userId = await _elasticStorage.GetUserAsync(imageId);
                var category = await _elasticStorage.GetCategoryAsync(imageId);
                dataToSend.Add(new Tuple<int, long, string>(userId,imageId,category));
            }

            var serializedData = JsonConvert.SerializeObject(dataToSend);
            _categoryProducer.Send(serializedData);
        }


        private async Task FindDuplicates(IEnumerable<ImageToProcessDTO> images)
        {
            var duplicates = new List<int>();
            var imageToProcessDtos = images.ToList();
            ImageToProcessDTO first = null;
            foreach (var dto in imageToProcessDtos)
            {
                first = dto;
                break;
            }

            if (first != null)
            {
                var comparisonResult = await _comparer.FindDuplicatesWithTollerance(first.UserId);
                foreach (var item in imageToProcessDtos)
                {
                    foreach (var result in comparisonResult)
                    {
                        if (result.Count <= 1) continue;

                        foreach (var itm in result)
                        {
                            if (itm.PhotoId != item.ImageId) continue;
                            duplicates.Add((int)item.ImageId);
                            break;
                        }
                    }
                }
            }

            var bytes = duplicates.SelectMany(BitConverter.GetBytes).ToArray();
            Log.Logger.Information("trying to send duplicates to PhotoAPI");
            _producer.Send(bytes);
            Log.Logger.Information("Duplicates sent to PhotoAPI");
        }

        private async Task<byte[]> GetImage(ImageType imageType, string fileName)
        {
            switch (imageType)
            {
                case ImageType.Photo: return await _photoBlobStore.GetPhoto(fileName);
                case ImageType.Avatar: return await _photoBlobStore.GetAvatar(fileName);

                default: throw new ArgumentException("Unexpected image type");
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
