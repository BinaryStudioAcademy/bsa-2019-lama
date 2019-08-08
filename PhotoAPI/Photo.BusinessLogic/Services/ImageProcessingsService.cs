using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Drawing;

namespace Photo.BusinessLogic.Services
{
    public static class ImageProcessingsService
    {
        public static byte[] CreateThumbnail(byte[] PassedImage, int LargestSide)
        {
            byte[] ReturnedThumbnail;

            using (MemoryStream StartMemoryStream = new MemoryStream(),
                                NewMemoryStream = new MemoryStream())
            {
                StartMemoryStream.Write(PassedImage, 0, PassedImage.Length);
                Bitmap startBitmap = new Bitmap(StartMemoryStream);
                int newHeight;
                int newWidth;
                double HW_ratio;
                if (startBitmap.Height > startBitmap.Width)
                {
                    newHeight = LargestSide;
                    HW_ratio = (double)((double)LargestSide / (double)startBitmap.Height);
                    newWidth = (int)(HW_ratio * (double)startBitmap.Width);
                }
                else
                {
                    newWidth = LargestSide;
                    HW_ratio = (double)((double)LargestSide / (double)startBitmap.Width);
                    newHeight = (int)(HW_ratio * (double)startBitmap.Height);
                }
                Bitmap newBitmap = new Bitmap(newWidth, newHeight);
                newBitmap = ResizeImage(startBitmap, newWidth, newHeight);  
                newBitmap.Save(NewMemoryStream, System.Drawing.Imaging.ImageFormat.Jpeg);
                ReturnedThumbnail = NewMemoryStream.ToArray();
            }
            return ReturnedThumbnail;
        }

        private static Bitmap ResizeImage(Bitmap image, int width, int height)
        {
            Bitmap resizedImage = new Bitmap(width, height);
            using (Graphics gfx = Graphics.FromImage(resizedImage))
            {
                gfx.DrawImage(image, new Rectangle(0, 0, width, height),
                    new Rectangle(0, 0, image.Width, image.Height), GraphicsUnit.Pixel);
            }
            return resizedImage;

        }
    }
}
