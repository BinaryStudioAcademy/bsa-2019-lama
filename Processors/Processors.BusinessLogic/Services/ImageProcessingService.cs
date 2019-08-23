using System.IO;
using System.Drawing;

namespace Processors.BusinessLogic.Services
{
    public class ImageProcessingService : Interfaces.IImageProcessingService
    {
        public byte[] CreateThumbnail(byte[] PassedImage, int LargestSide)
        {
            byte[] returnedThumbnail;

            using (MemoryStream startMemoryStream = new MemoryStream(),
                                newMemoryStream = new MemoryStream())
            {
                startMemoryStream.Write(PassedImage, 0, PassedImage.Length);
                var startBitmap = new Bitmap(startMemoryStream);
                int newHeight;
                int newWidth;
                double HW_ratio;
                if (startBitmap.Height > startBitmap.Width)
                {
                    newHeight = LargestSide;
                    HW_ratio = LargestSide / (double)startBitmap.Height;
                    newWidth = (int)(HW_ratio * startBitmap.Width);
                }
                else
                {
                    newWidth = LargestSide;
                    HW_ratio = LargestSide / (double)startBitmap.Width;
                    newHeight = (int)(HW_ratio * startBitmap.Height);
                }

                var newBitmap = ResizeImage(startBitmap, newWidth, newHeight);
                newBitmap.Save(newMemoryStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                returnedThumbnail = newMemoryStream.ToArray();
            }
            return returnedThumbnail;
        }

        private Bitmap ResizeImage(Bitmap image, int width, int height)
        {
            var resizedImage = new Bitmap(width, height);
            using (var gfx = Graphics.FromImage(resizedImage))
            {
                gfx.DrawImage(image, new Rectangle(0, 0, width, height),
                    new Rectangle(0, 0, image.Width, image.Height), GraphicsUnit.Pixel);
            }
            return resizedImage;
        }
    }
}
