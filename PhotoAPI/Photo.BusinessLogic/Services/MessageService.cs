using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Timers;
using Photo.BusinessLogic.Interfaces;
using Photo.DataAccess.Interfaces;
using Photo.Domain.Settings;
using Photo.Domain.DataTransferObjects;
using RabbitMQ.Client.Events;
using Serilog;
using Timer = System.Timers.Timer;

namespace Photo.BusinessLogic.Services
{
    public class MessageService : IMessageService, IDisposable
    {
        private readonly MessageServiceSettings _serviceData;
        private readonly DuplicatesService _duplicatesService;
        private readonly ImageProcessingService _imageProcessingService;
        private readonly ImageCompareService _imageCompareService;
        private readonly IElasticStorage _elasticStorage;

        public MessageService(MessageServiceSettings messageServiceSettings, DuplicatesService service, ImageProcessingService imageProcessingService, ImageCompareService imageCompareService, IElasticStorage elasticStorage)
        {
            _serviceData = messageServiceSettings;
            _duplicatesService = service;
            _imageProcessingService = imageProcessingService;
            _imageCompareService = imageCompareService;
            _elasticStorage = elasticStorage;
            messageServiceSettings.PhotoProcessorConsumer.Received += Get;
            messageServiceSettings.PhotoProcessorConsumer.Connect();
        }



        public void Dispose()
        {
            _serviceData.PhotoProcessorProducer?.Dispose();
            Log.Logger.Information("PhotoApi producer disposed");
        }


        public async void Get(object sender, BasicDeliverEventArgs args)
        {
            switch (args.RoutingKey)
            {
                case "getDuplicates":
                    { 
                        var originalList = Enumerable.Range(0, args.Body.Length / 4)
                            .Select(i => BitConverter.ToInt32(args.Body, i * 4))
                            .ToList();
                        if (originalList.Count > 0)
                        {
                            var photo = await _elasticStorage.Get(originalList.FirstOrDefault());
                            var user = photo.UserId;
                            var comparisonResult = await _imageCompareService.FindDuplicatesWithTollerance(user);
                            var duplicates = new List<int>();
                            var groupedDuplicates = new List<List<int>>();
                            foreach (var result in comparisonResult)
                            {
                                foreach (var item in originalList)
                                {
                                    if (result.Count <= 1) continue;
                                    foreach (var itm in result)
                                    {
                                        if (itm.PhotoId != item) continue;
                                        duplicates.Add(item);
                                    }
                                }
                                var count = 0;
                                foreach (var it in originalList)
                                {
                                    if (duplicates.Contains(it))
                                        count++;
                                }
                                if (count == result.Count)
                                {
                                    duplicates.Remove(duplicates.FirstOrDefault());
                                }
                                if (duplicates.Count > 0)
                                    groupedDuplicates.Add(duplicates);
                                duplicates = new List<int>();
                            }

                            if (groupedDuplicates.Count > 0)
                            {
                                await _duplicatesService.SendDuplicates(groupedDuplicates);
                            }

                            _serviceData.PhotoProcessorConsumer.SetAcknowledge(args.DeliveryTag, true);
                        }
                        break;
                        
                    }
                case "getImageCategory":
                    {
                        await _imageProcessingService.SendCategory(Encoding.Default.GetString(args.Body));
                        break;
                    }
            }
            _serviceData.PhotoProcessorConsumer.SetAcknowledge(args.DeliveryTag, true);
        }


        public void SendToThumbnailProcessor(IEnumerable<ImageToProcessDTO> makePhotoThumbnail)
        {
            if (makePhotoThumbnail == null) throw new System.ArgumentNullException(nameof(makePhotoThumbnail));
            foreach (var imageToProcessDto in makePhotoThumbnail)
            {
                imageToProcessDto.ImageType = Domain.Enums.ImageType.Photo;
            }
            var objectJson = JsonConvert.SerializeObject(makePhotoThumbnail);
            var body = Encoding.ASCII.GetBytes(objectJson);


            _serviceData.PhotoProcessorProducer.Send(body);
        }

        public void SendPhotoToThumbnailProcessor(IEnumerable<ImageToProcessDTO> images)
        {
            var imageToProcessDtos = images.ToList();
            foreach (var item in imageToProcessDtos)
            {
                item.ImageType = Domain.Enums.ImageType.Photo;
            }
            SendToThumbnailProcessor(imageToProcessDtos);
        }
        public void SendAvatarToThumbnailProcessor(IEnumerable<ImageToProcessDTO> images)
        {
            var imageToProcessDtos = images.ToList();
            foreach (var item in imageToProcessDtos)
            {
                item.ImageType = Domain.Enums.ImageType.Avatar;
            }
            SendToThumbnailProcessor(imageToProcessDtos);
        }
    }
}
