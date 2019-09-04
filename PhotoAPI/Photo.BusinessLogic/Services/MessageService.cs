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
using Timer = System.Timers.Timer;

namespace Photo.BusinessLogic.Services
{
    public class MessageService : Interfaces.IMessageService, System.IDisposable
    {
         private readonly MessageServiceSettings _serviceData;
        private readonly DuplicatesService _photoService;

        public MessageService(MessageServiceSettings messageServiceSettings, DuplicatesService service)
        {
            this._serviceData = messageServiceSettings;
            _photoService = service;
            messageServiceSettings.PhotoProcessorConsumer.Received += Get;
            messageServiceSettings.PhotoProcessorConsumer.Connect();
        }

        public void Dispose()
        {
            _serviceData.PhotoProcessorProducer?.Dispose();
        }


        public async void Get(object sender, BasicDeliverEventArgs args)
        {
            var originalList = Enumerable.Range(0, args.Body.Length / 4)
                    .Select(i => BitConverter.ToInt32(args.Body, i * 4))
                    .ToList();
            if (originalList.Count > 0)
            {
                await _photoService.SendDuplicates(originalList);
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
