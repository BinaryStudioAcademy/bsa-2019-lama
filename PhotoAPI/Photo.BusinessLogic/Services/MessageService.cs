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
        // FIELDS
        MessageServiceSettings serviceData;
        private readonly DuplicatesService _photoService;

        // CONSTRUCTORS
        public MessageService(MessageServiceSettings messageServiceSettings, DuplicatesService service)
        {
            this.serviceData = messageServiceSettings;
            _photoService = service;
            messageServiceSettings.PhotoProcessorConsumer.Received += Get;
            messageServiceSettings.PhotoProcessorConsumer.Connect();
        }

        public void Dispose()
        {
            serviceData.PhotoProcessorProducer?.Dispose();
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
            serviceData.PhotoProcessorConsumer.SetAcknowledge(args.DeliveryTag, true);
        }

        // METHODS
        public void SendToThumbnailProcessor(IEnumerable<ImageToProcessDTO> makePhotoThumbnail)
        {
            if (makePhotoThumbnail == null) throw new System.ArgumentNullException(nameof(makePhotoThumbnail));
            foreach (var imageToProcessDto in makePhotoThumbnail)
            {
                imageToProcessDto.ImageType = Domain.Enums.ImageType.Photo;
            }
            string objectJson = JsonConvert.SerializeObject(makePhotoThumbnail);
            var body = Encoding.ASCII.GetBytes(objectJson);


            serviceData.PhotoProcessorProducer.Send(body);
        }

        public void SendPhotoToThumbnailProcessor(IEnumerable<ImageToProcessDTO> images)
        {
            foreach (var item in images)
            {
                item.ImageType = Domain.Enums.ImageType.Photo;
            }
            this.SendToThumbnailProcessor(images);
        }
        public void SendAvatarToThumbnailProcessor(IEnumerable<ImageToProcessDTO> images)
        {
            foreach (var item in images)
            {
                item.ImageType = Domain.Enums.ImageType.Avatar;
            }
            this.SendToThumbnailProcessor(images);
        }
    }
}
