namespace Processors.BusinessLogic.Interfaces
{
    public interface IImageProcessingService
    {
        byte[] CreateThumbnail(byte[] PassedImage, int LargestSide);
    }
}
