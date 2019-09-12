using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;

namespace Services.Models
{
    public class ImgHash
    {
        private readonly int _hashSide;
        public long PhotoId { get; set; }
        public List<bool> HashData { get; set; }
        public string BlobId { get; set; }

        public ImgHash(long id, List<bool> hash = null, int hashSideSize = 24)
        {
            _hashSide = hashSideSize;
            HashData = hash;
            PhotoId = id;
        }

        public double CompareWith(ImgHash compareWith)
        {
            if (HashData.Count != compareWith.HashData.Count)
            {
                throw new Exception("Cannot compare hashes with different sizes");
            }
            double differenceCounter = 0;
            if (compareWith.HashData == null) return (HashData.Count - differenceCounter) / HashData.Count * 100;
            for (var i = 0; i < HashData.Count; i++)
            {
                if (HashData[i] != compareWith.HashData[i])
                {
                    differenceCounter++;
                }
            }

            return (HashData.Count - differenceCounter) / HashData.Count * 100;
        }

        public List<bool> GenerateFromByteArray(byte[] bytes)
        {
            var image = (Bitmap)Image.FromStream(new MemoryStream(bytes), true);
            return GenerateFromImage(image);
        }

        private List<bool> GenerateFromImage(Bitmap img)
        {
            var lResult = new List<bool>();

            //resize img to 16x16px (by default) or with configured size 
            var bmpMin = new Bitmap(img, new Size(_hashSide, _hashSide));

            for (int j = 0; j < bmpMin.Height; j++)
            {
                for (int i = 0; i < bmpMin.Width; i++)
                {
                    //reduce colors to true and false
                    lResult.Add(bmpMin.GetPixel(i, j).GetBrightness() < 0.5f);
                }
            }
            HashData = lResult;
            bmpMin.Dispose();
            return lResult;
        }
    }
}
