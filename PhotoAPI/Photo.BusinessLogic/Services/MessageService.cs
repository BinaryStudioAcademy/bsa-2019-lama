using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Timers;
using Photo.Domain.Settings;
using Photo.Domain.DataTransferObjects;
using Timer = System.Timers.Timer;

namespace Photo.BusinessLogic.Services
{
    public class MessageService : Interfaces.IMessageService, System.IDisposable
    {
        // FIELDS
        MessageServiceSettings serviceData;

        // CONSTRUCTORS
        public MessageService(MessageServiceSettings messageServiceSettings)
        {
            this.serviceData = messageServiceSettings;
            Timer timer = new Timer();
            timer.Interval = 2500;
            timer.Elapsed += RunAsync;
            timer.Start();
        }

        public void Dispose()
        {
            serviceData.PhotoProcessorProducer?.Dispose();
        }

        public async Task ReceiveDuplicates(bool isDuplicate)
        {
            Console.WriteLine(isDuplicate);
        }
        public async void RunAsync(object sender, ElapsedEventArgs e)
        {
            var receiveData = serviceData.PhotoProcessorConsumer.Receive(1000);
                if (receiveData == null) return;
                Console.WriteLine(receiveData);
                var isDuplicate = BitConverter.ToBoolean(receiveData.Body);
                await ReceiveDuplicates(isDuplicate);
                serviceData.PhotoProcessorConsumer.SetAcknowledge(receiveData.DeliveryTag, true);
        }



        // METHODS
        public void SendToThumbnailProcessor(MakePhotoThumbnailDTO makePhotoThumbnail)
        {
            if (makePhotoThumbnail == null) throw new System.ArgumentNullException(nameof(makePhotoThumbnail));

            string objectJson = JsonConvert.SerializeObject(makePhotoThumbnail);

            serviceData.PhotoProcessorProducer.Send(objectJson);
        }
        public void SendPhotoToThumbnailProcessor(long imageId)
        {
            this.SendToThumbnailProcessor(new MakePhotoThumbnailDTO
            {
                ImageId = imageId,
                ImageType = Domain.Enums.ImageType.Photo
            });
        }
        public void SendAvatarToThumbnailProcessor(long imageId)
        {
            this.SendToThumbnailProcessor(new MakePhotoThumbnailDTO
            {
                ImageId = imageId,
                ImageType = Domain.Enums.ImageType.Avatar
            });
        }
    }
}
