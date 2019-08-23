namespace Processors.BusinessLogic.Interfaces
{
    public interface IImageProcessingService
    {
        byte[] CreateThumbnail(byte[] passedImage, int largestSide);
    }
}
