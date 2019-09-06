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

        public MessageService(MessageServiceSettings messageServiceSettings, DuplicatesService service, ImageProcessingService imageProcessingService)
        {
            _serviceData = messageServiceSettings;
            _duplicatesService = service;
            _imageProcessingService = imageProcessingService;
            messageServiceSettings.PhotoProcessorConsumer.Received += Get;
            //messageServiceSettings.PhotoProcessorConsumer.Received += GetPhotoCategory;
            messageServiceSettings.PhotoProcessorConsumer.Connect();
            Log.Logger.Information("PhotoAPI messageService constuctor");
        }



        public void Dispose()
        {
            serviceData.PhotoProcessorProducer?.Dispose();
            Log.Logger.Information("PhotoApi producer disposed");
        }


        public async void Get(object sender, BasicDeliverEventArgs args)
        {
            switch (args.RoutingKey)
            {
                case "getDuplicates":
                {
                    Log.Logger.Information("Duplication received");
                    var originalList = Enumerable.Range(0, args.Body.Length / 4)
                        .Select(i => BitConverter.ToInt32(args.Body, i * 4))
                        .ToList();
                    if (originalList.Count > 0)
                    {
                        await _duplicatesService.SendDuplicates(originalList);
                    }
                    _serviceData.PhotoProcessorConsumer.SetAcknowledge(args.DeliveryTag, true);
                    break;
                }
                case "getImageCategory":
                {
                    await _imageProcessingService.SendCategory(Encoding.Default.GetString(args.Body));
                    break;
                }
            }
            Log.Logger.Information("Trying to set anknowledge(photoApi)");
            serviceData.PhotoProcessorConsumer.SetAcknowledge(args.DeliveryTag, true);
            Log.Logger.Information("Anknowvledge is set");
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
