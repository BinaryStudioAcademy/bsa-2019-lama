using Newtonsoft.Json;
using Processors.BusinessLogic.Interfaces;
using Processors.DataAccess.Interfaces;
using Processors.Domain;
using Processors.Domain.DTO;
using Services.Interfaces;
using Services.Models;
using System.Threading.Tasks;

namespace Processors.BusinessLogic.Services
{
    public class MessageServices : IMessageService
    {
        private readonly IImageProcessingService _imageProcessingService;

        private readonly IElasticStorage _elasticStorage;
        private readonly IPhotoBlobStorage _photoBlobStore;

        private readonly IConsumer _consumer;

        // CONSTRUCTORS
        public MessageServices(IImageProcessingService imageProcessingService, IElasticStorage elasticStorage, IPhotoBlobStorage photoBlobStore, IConsumer consumer)
        {
            _imageProcessingService = imageProcessingService;

            _elasticStorage = elasticStorage;
            _photoBlobStore = photoBlobStore;

            _consumer = consumer;
        }

        public void Dispose()
        {
            _consumer?.Dispose();
        }

        public async Task RunAsync(int millisecondsTimeout)
        {
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
            var address = await _elasticStorage.GetBlobId(makePhotoThumbnailDTO.ImageId);
            var fileName = address.Substring(address.LastIndexOf('/') + 1);
            var currentImg = await GetImage(makePhotoThumbnailDTO.ImageType, fileName);

            var image64 = _imageProcessingService.CreateThumbnail(currentImg, 64);
            var image256 = _imageProcessingService.CreateThumbnail(currentImg, 256);

            if (await _elasticStorage.ExistAsync(makePhotoThumbnailDTO.ImageId))
            {
                var thumbnailUpdateDTO = await LoadImageToBlob(makePhotoThumbnailDTO.ImageType, image64, image256);

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
        private async Task<ThubnailUpdateDTO> LoadImageToBlob(ImageType imageType, byte[] image64, byte[] image256)
        {
            if (ImageType.Avatar == imageType)
            {
                return new ThubnailUpdateDTO
                {
                    Blob64Id = await _photoBlobStore.LoadAvatarToBlob(image64),
                    Blob256Id = await _photoBlobStore.LoadAvatarToBlob(image256),
                };
            }
            else if (ImageType.Photo == imageType)
            {
                return new ThubnailUpdateDTO
                {
                    Blob64Id = await _photoBlobStore.LoadPhotoToBlob(image64),
                    Blob256Id = await _photoBlobStore.LoadPhotoToBlob(image256),
                };
            }
            else throw new System.ArgumentException("Unexpected image type");
        }
    }
}
