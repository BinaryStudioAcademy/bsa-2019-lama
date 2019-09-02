using System;
using System.Collections.Generic;
using System.Text;

namespace Photo.Domain.ImageHashModels
{
     public class ImgHash
    {
        private readonly int _hashSide;
        public long PhotoId { get; set; }
        public List<bool> HashData { get; set; }
        public string BlobId { get; set; }

        public ImgHash(List<bool> hash, long id, string blobId, int hashSideSize = 16)
        {
            _hashSide = hashSideSize;
            HashData = hash;
            PhotoId = id;
            BlobId = blobId;
        }

        public double CompareWith(ImgHash compareWith)
        {
                if (HashData.Count != compareWith.HashData.Count)
                {
                    throw new Exception("Cannot compare hashes with different sizes");
                }
                double differenceCounter = 0;

                for (int i = 0; i < HashData.Count; i++)
                {
                    if (HashData[i] != compareWith.HashData[i])
                    {
                        differenceCounter++;
                    }
                }
            return (HashData.Count - differenceCounter) / HashData.Count * 100;
        }
    }
}
