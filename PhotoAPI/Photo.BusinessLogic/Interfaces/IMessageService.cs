using System.Collections.Generic;
using System.Threading.Tasks;
using System.Timers;
using Photo.Domain.DataTransferObjects;

namespace Photo.BusinessLogic.Interfaces
{
    public interface IMessageService
    {
        void SendToThumbnailProcessor(IEnumerable<ImageToProcessDTO> makePhotoThumbnail);
        void SendPhotoToThumbnailProcessor(IEnumerable<ImageToProcessDTO> images);
        void SendAvatarToThumbnailProcessor(IEnumerable<ImageToProcessDTO> images);
        //Task RunAsync(int timeout);
        /*void RunAsync(object sender, ElapsedEventArgs e);*/
    }
}
