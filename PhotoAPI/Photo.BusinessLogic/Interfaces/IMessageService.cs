using Photo.Domain.DataTransferObjects;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IMessageService
    {
        void SendToThumbnailProcessor(MakePhotoThumbnailDTO makePhotoThumbnail);

        void SendPhotoToThumbnailProcessor(long imageId);
        void SendAvatarToThumbnailProcessor(long imageId);
    }
}
