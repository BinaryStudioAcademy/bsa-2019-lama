﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Photo.DataAccess.Interfaces;
using Photo.Domain.ImageHashModels;

namespace Photo.BusinessLogic.Services
{
    public class ImageCompareService
    {
        private readonly IElasticStorage _elasticStorage;
        private readonly int _hashSize = 128;

        private readonly List<ImgHash> _hashLib = new List<ImgHash>();

        public ImageCompareService(IElasticStorage elasticStorage)
        {
            _elasticStorage = elasticStorage;
        }

        private List<ImgHash> FindDuplicatesTo(ImgHash hash, int minSimilarity, ref List<ImgHash> alreadyMarkedAsDupl)
        {
            var currHashDupl = new List<ImgHash>();

            foreach (var hashCompareWith in _hashLib)
            {
                if (hash.CompareWith(hashCompareWith) >= minSimilarity)
                {
                    if (!alreadyMarkedAsDupl.Contains(hash))
                    {
                        alreadyMarkedAsDupl.Add(hash);

                        currHashDupl.Add(hash);
                    }

                    if (!alreadyMarkedAsDupl.Contains(hashCompareWith))
                    {
                        alreadyMarkedAsDupl.Add(hashCompareWith);

                        currHashDupl.Add(hashCompareWith);
                    }
                }
            }
            return currHashDupl;
        }

        private async Task InitializeHashes(int userId)
        {
            var photos = await _elasticStorage.GetUserPhotos(userId);
            foreach (var item in photos)
            {
                _hashLib.Add(new ImgHash(item.Hash, item.Id, item.BlobId));
            }
        }

        public async Task<List<List<ImgHash>>> FindDuplicatesWithTollerance(int userId, int minSimilarity = 90)
        {
            await InitializeHashes(userId);
            List<ImgHash> alreadyMarkedAsDupl = new List<ImgHash>();

            var duplicatesFound = new List<List<ImgHash>>();

            foreach (var hash in _hashLib)
            {
                if (alreadyMarkedAsDupl.Contains(hash) == false)
                {
                    var singleImgDuplicates = FindDuplicatesTo(hash, minSimilarity, ref alreadyMarkedAsDupl);

                    duplicatesFound.Add(singleImgDuplicates);
                }
            }
            return duplicatesFound;
        }
    }
}
