using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Timers;
using Photo.BusinessLogic.Interfaces;
using Photo.Domain.Settings;
using Photo.Domain.DataTransferObjects;
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
            Timer timer = new Timer();
            timer.Interval = 2500;
            timer.Elapsed += RunAsync;
            timer.Start();
        }

        public void Dispose()
        {
            serviceData.PhotoProcessorProducer?.Dispose();
        }

        public async Task ReceiveDuplicates(List<int> duplicates)
        {
            if (duplicates.Count > 0)
            {
                await _photoService.SendDuplicates(duplicates);
            }
        }
        public async void RunAsync(object sender, ElapsedEventArgs e)
        {
            var receiveData = serviceData.PhotoProcessorConsumer.Receive(1000);
                if (receiveData == null) return;
                Console.WriteLine(receiveData);
                var originalList = Enumerable.Range(0, receiveData.Body.Length / 4)
                .Select(i => BitConverter.ToInt32(receiveData.Body, i * 4))
                .ToList();

            await ReceiveDuplicates(originalList);
                serviceData.PhotoProcessorConsumer.SetAcknowledge(receiveData.DeliveryTag, true);
        }



        // METHODS
        public void SendToThumbnailProcessor(IEnumerable<ImageToProcessDTO> makePhotoThumbnail)
        {
            if (makePhotoThumbnail == null) throw new System.ArgumentNullException(nameof(makePhotoThumbnail));

            string objectJson = JsonConvert.SerializeObject(makePhotoThumbnail);

            serviceData.PhotoProcessorProducer.Send(objectJson);
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
