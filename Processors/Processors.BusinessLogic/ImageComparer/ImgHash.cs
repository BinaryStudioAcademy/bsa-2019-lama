﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Drawing;
using System.IO;
using Processors.DataAccess.Interfaces;
using Processors.Domain.DTO;

namespace Processors.BusinessLogic.ImageComparer
{
    [Serializable]
    public class ImgHash
    {
        private readonly int _hashSide;
        private readonly IElasticStorage _elasticStorage;
        private bool[] _hashData;
        public int PhotoId { get; set; }

        public bool[] HashData
        {
            get { return _hashData; }
        }
        

        private string _imgSize;
        public string ImgSize
        {
            get { return _imgSize; }
        }


        public ImgHash(int photoId, IElasticStorage elasticStorage, List<bool> hash = null, int hashSideSize = 16)
        {
            _hashSide = hashSideSize;
            _elasticStorage = elasticStorage;
            if (hash == null)
            {
                _hashData = new bool[hashSideSize * hashSideSize];
            }
            else
            {
                _hashData = hash.ToArray();
            }
            PhotoId = photoId;
        }

        /// <summary>
        /// Method to compare 2 image hashes
        /// </summary>
        /// <returns>% of similarity</returns>
        public double CompareWith(ImgHash compareWith)
        {
            if (HashData.Length != compareWith.HashData.Length)
            {
                throw new Exception("Cannot compare hashes with different sizes");
            }

            double differenceCounter = 0;

            for (int i = 0; i < HashData.Length; i++)
            {
                if (HashData[i] != compareWith.HashData[i])
                {
                    differenceCounter++;
                }
            }

            return (HashData.Length - differenceCounter) / HashData.Length * 100;
        }

        public List<bool> GenerateFromByteArray(Byte[] bytes)
        {
            Bitmap image = (Bitmap)Image.FromStream(new MemoryStream(bytes), true);

            _imgSize = $"{image.Size.Width}x{image.Size.Height}";

            return GenerateFromImage(image);

            image.Dispose();
        }

        private List<bool> GenerateFromImage(Bitmap img)
        {
            List<bool> lResult = new List<bool>();

            //resize img to 16x16px (by default) or with configured size 
            Bitmap bmpMin = new Bitmap(img, new Size(_hashSide, _hashSide));

            for (int j = 0; j < bmpMin.Height; j++)
            {
                for (int i = 0; i < bmpMin.Width; i++)
                {
                    //reduce colors to true and false
                    lResult.Add(bmpMin.GetPixel(i, j).GetBrightness() < 0.5f);
                }
            }

            _hashData = lResult.ToArray();

            bmpMin.Dispose();
            return new List<bool>(_hashData);
        }
    }
}
