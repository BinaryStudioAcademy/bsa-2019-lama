using Newtonsoft.Json;

using Photo.Domain.Settings;
using Photo.Domain.DataTransferObjects;

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
        }

        public void Dispose()
        {
            serviceData.PhotoProcessorProducer?.Dispose();
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
            SendToThumbnailProcessor(new MakePhotoThumbnailDTO
            {
                ImageId = imageId,
                ImageType = Domain.Enums.ImageType.Photo
            });
        }
        public void SendAvatarToThumbnailProcessor(long imageId)
        {
            SendToThumbnailProcessor(new MakePhotoThumbnailDTO
            {
                ImageId = imageId,
                ImageType = Domain.Enums.ImageType.Avatar
            });
        }
    }
}
