using System.Collections.Generic;
using System.Threading.Tasks;
using System.Timers;
using Photo.Domain.DataTransferObjects;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IMessageService
    {
        void SendToThumbnailProcessor(MakePhotoThumbnailDTO makePhotoThumbnail);

        void SendPhotoToThumbnailProcessor(long imageId);
        void SendAvatarToThumbnailProcessor(long imageId);
        Task ReceiveDuplicates(bool isDuplicates);
        //Task RunAsync(int timeout);
        void RunAsync(object sender, ElapsedEventArgs e);
    }
}
