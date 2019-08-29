using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using Photo.Domain.BlobModels;
using Photo.BusinessLogic.Interfaces;
using Photo.DataAccess.Interfaces;
using Photo.Domain.DataTransferObjects;

using AutoMapper;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading;
using Nest;

namespace Photo.BusinessLogic.Services
{
    public class PhotoService : IPhotoService
    {
        private readonly IElasticStorage _elasticStorage;
        private readonly IPhotoBlobStorage _storage;
        private readonly IMessageService _messageService;
        private readonly IMapper _mapper;
        private readonly string _blobUrl;

        public PhotoService(IElasticStorage elasticStorage, IPhotoBlobStorage storage, IMessageService messageService, IMapper mapper, string blobUrl)
        {
            _elasticStorage = elasticStorage;
            _storage = storage;
            _messageService = messageService;
            _mapper = mapper;
            _blobUrl = blobUrl;
        }

        public Task<IEnumerable<PhotoDocument>> Find(int id, string criteria)
        {
            return _elasticStorage.Find(id, criteria);
        }

        public Task<Dictionary<string, List<string>>> FindFields(int id, string criteria)
        {
            return _elasticStorage.FindFields(id, criteria);
        }

        public async Task<List<Byte[]>> GetPhotos(PhotoDocument[] values)
        {
            return await _storage.GetPhotos(values);
        }
        public async Task<string> GetPhoto (string blobId)
        {
            return await _storage.GetPhoto(blobId);
        }

        public async Task<string> GetAvatar(string blobId)
        {
            return await _storage.GetAvatar(blobId);
        }
        
        public Task<IEnumerable<PhotoDocument>> Get()
        {
            return _elasticStorage.Get();
        }
        public Task<IEnumerable<PhotoDocument>> GetUserPhotos(int userId)
        {
            return _elasticStorage.GetUserPhotos(userId);
        }
        public Task<PhotoDocument> Get(int elasticId)
        {
            return _elasticStorage.Get(elasticId);
        }
        public Task<IEnumerable<PhotoDocument>> GetUserPhotosRange(int userId, int startId, int count)
        {
            return _elasticStorage.GetUserPhotosRange(userId, startId, count);
        }

        public async Task Delete(int id)
        {
            await _elasticStorage.DeleteAsync(id);
            await DeleteAllBlobsAsync(id);
        }

        public async Task Update(PhotoDocument item)
        {
            await _elasticStorage.UpdateAsync(item);
        }

        public async Task<UpdatedPhotoResultDTO> UpdateImage(UpdatePhotoDTO updatePhotoDTO)
        {
            var filename = Path.GetFileName(updatePhotoDTO.BlobId);
            var ext = Path.GetExtension(filename);
            var file = filename.Replace(ext, "");
            var base64 = ConvertToBase64(imageUrl: updatePhotoDTO.ImageBase64);
            var newImageBlob = Convert.FromBase64String(base64);
            await DeleteOldBlobsAsync(elasticId: updatePhotoDTO.Id);
            var blobId = await _storage.LoadPhotoToBlob(newImageBlob, $"{filename}");
            var updatedPhoto = new UpdatedPhotoResultDTO
            {
                BlobId = blobId,
                Blob64Id = blobId,
                Blob256Id = blobId
            };
            await _elasticStorage.UpdatePartiallyAsync(updatePhotoDTO.Id, updatedPhoto);
            _messageService.SendPhotoToThumbnailProcessor(updatePhotoDTO.Id); 
            return updatedPhoto;
        }

        private async Task DeleteOldBlobsAsync(int elasticId)
        {
            var photoDocument = await Get(elasticId);
            
            await _storage.DeleteFileAsync(photoDocument.BlobId);
            await _storage.DeleteFileAsync(photoDocument.Blob64Id);
            await _storage.DeleteFileAsync(photoDocument.Blob256Id);
        }

        private async Task<string> ResetBlobAsync(int elasticId)
        {
            var photoDocument = await Get(elasticId);

            await _storage.DeleteFileAsync(photoDocument.BlobId);
            await _storage.DeleteFileAsync(photoDocument.Blob64Id);
            await _storage.DeleteFileAsync(photoDocument.Blob256Id);

            return photoDocument.OriginalBlobId;
        }


        public async Task<CreateResponse> Create(PhotoDocument item)
        {
            return await _elasticStorage.CreateAsync(item);
        }

        public async Task<PhotoDocument> UpdateWithSharedLink(int id, string sharedLink)
        {
            // TODO: figure out getting updated document without second request to elastic           
            
            var updateLinkObject = new { SharedLink = sharedLink };

            await _elasticStorage.UpdatePartiallyAsync(id, updateLinkObject);

            return await _elasticStorage.Get(id);
        }

        public async Task<IEnumerable<CreatePhotoResultDTO>> CreateDuplicates(IEnumerable<CreatePhotoResultDTO> duplicates)
        {
            var createdDuplicates = new List<CreatePhotoResultDTO>();
            foreach (var duplicate in duplicates)
            {
                var mappedToPhotoDocument = _mapper.Map<PhotoDocument>(duplicate);
                await Create(mappedToPhotoDocument);
                createdDuplicates.Add(_mapper.Map<CreatePhotoResultDTO>(mappedToPhotoDocument));
                _messageService.SendPhotoToThumbnailProcessor(mappedToPhotoDocument.Id);
            }

            return createdDuplicates;
        }

        public async Task<IEnumerable<CreatePhotoResultDTO>> FindDuplicates(int userId)
        {
            var foundDuplicates = new List<CreatePhotoResultDTO>();
            var userPhotos = await GetUserPhotos(userId);
            foreach (var photo in userPhotos)
            {
                var photosWithSameName = await _elasticStorage.Find(userId, photo.Name);
                var collectionWithSameNames = photosWithSameName.Where(element => element.IsDeleted == false).ToList();
                if (collectionWithSameNames.Count <= 1 || !IsSameSized(collectionWithSameNames, photo)) continue;
                
                var mappedPhoto = _mapper.Map<CreatePhotoResultDTO>(photo);
                foundDuplicates.Add(mappedPhoto);
            }

            return foundDuplicates.GroupBy(x => x.Name).Where(g => g.Count() > 1)
                .SelectMany(t => t.OrderByDescending(r => r.Id).Skip(1));
        }

        public async Task<IEnumerable<CreatePhotoResultDTO>> Create(IEnumerable<CreatePhotoDTO> items)
        {
            var createdPhotos = new List<CreatePhotoResultDTO>();
            foreach(var item in items)
            {
                var base64 = ConvertToBase64(item.ImageUrl);
                var blob = Convert.FromBase64String(base64);
                var blobId = await _storage.LoadPhotoToBlob(blob);
                var filesWithSameName = await _elasticStorage.Find(item.AuthorId, item.FileName);
                var collectionWithSameNameFiles = filesWithSameName.ToList();
                if (collectionWithSameNameFiles.Any() && IsSameSized(collectionWithSameNameFiles, item))
                {
                    var duplicatePhotoDocument = new CreatePhotoResultDTO
                    {
                        Id = item.Id,
                        Name = item.FileName,
                        Description = item.Description,
                        BlobId = blobId,
                        Blob64Id = blobId,
                        Blob256Id = blobId,
                        OriginalBlobId = await _storage.LoadPhotoToBlob(blob),
                        UserId = item.AuthorId,
                        IsDuplicate = true
                    };
                    createdPhotos.Add(duplicatePhotoDocument);
                }
                else
                {
                    var photoDocumentToCreate = new PhotoDocument
                    {
                        Id = item.Id,
                        Name = item.FileName,
                        BlobId = blobId,
                        Blob64Id = blobId,
                        Blob256Id = blobId,
                        OriginalBlobId = await _storage.LoadPhotoToBlob(blob),
                        UserId = item.AuthorId,
                        Location = item.Location,
                        Description = item.Description,
                        Coordinates = item.Coordinates
                    };

                    await Create(photoDocumentToCreate);
                    createdPhotos.Add(_mapper.Map<CreatePhotoResultDTO>(photoDocumentToCreate));
                    _messageService.SendPhotoToThumbnailProcessor(photoDocumentToCreate.Id);
                }
            }
            return createdPhotos;
        }

        public async Task<int> CreateAvatar(CreatePhotoDTO item)
        {
            var base64 = ConvertToBase64(item.ImageUrl);
            var blob = Convert.FromBase64String(base64);
            var blobId = await _storage.LoadAvatarToBlob(blob);
            await Create(new PhotoDocument
            {
                Id = item.Id,
                Name = Guid.NewGuid().ToString(),
                BlobId = blobId,
                Blob64Id = blobId,
                Blob256Id = blobId,
                OriginalBlobId = await _storage.LoadAvatarToBlob(blob),
                UserId = item.AuthorId,
                Description = item.Description
            });
            _messageService.SendAvatarToThumbnailProcessor(item.Id);
            return item.Id;
        }
        private static string ConvertToBase64(string imageUrl)
        {
            // TODO: change this to regex
            return imageUrl
                    .Replace("data:image/jpeg;base64,", String.Empty)
                    .Replace("data:image/png;base64,", String.Empty)
                    .Replace("-", "+").Replace("_", "/");
        }

        #region DELETE
        public Task MarkPhotoAsDeleted(int photoId)
        {
            var updateDeleteField = new { IsDeleted = true };

            return _elasticStorage.UpdatePartiallyAsync(photoId, updateDeleteField);
        }

        public async Task<DeletedPhotoDTO[]> GetDeletedPhotos(int userId)
        {
            var searchResult = await _elasticStorage.GetDeletedPhoto(userId);            
            
            return _mapper.Map<DeletedPhotoDTO[]>(searchResult);
        }

        public async Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            // TODO: make this in single request
            foreach (var deletePhoto in photosToDelete)
            {       
                await DeleteAllBlobsAsync(deletePhoto.Id);

                await _elasticStorage.DeleteAsync(deletePhoto.Id);
            }
        }

        private async Task DeleteAllBlobsAsync(int elasticId)
        {
            var photoDocument = await Get(elasticId);

            await _storage.DeleteFileAsync(photoDocument.BlobId);
            await _storage.DeleteFileAsync(photoDocument.Blob64Id);
            await _storage.DeleteFileAsync(photoDocument.Blob256Id);
            await _storage.DeleteFileAsync(photoDocument.OriginalBlobId);
        }


        public async Task RestoresDeletedPhotos(PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            // TODO: make this in single request
            foreach (var restorePhoto in photosToRestore)
            {
                var updateDeleteField = new { IsDeleted = false };

                await _elasticStorage.UpdatePartiallyAsync(restorePhoto.Id, updateDeleteField);
            }
        }
        #endregion
        
        private bool IsSameSized(IEnumerable<PhotoDocument> photoDocumentsCollection, CreatePhotoDTO item)
        {
            var newItemBase64 = ConvertToBase64(item.ImageUrl);
            var newItemBlob = Convert.FromBase64String(newItemBase64);
            using (var webClient = new WebClient())
            {
                bool doc = false;
                try
                {
                    doc = photoDocumentsCollection.Select(element => $"{_blobUrl}{element.BlobId}")
                        .Select(existingUrl => webClient.DownloadData(existingUrl))
                        .Any(existingItemBlob => existingItemBlob.SequenceEqual(newItemBlob));
                }
                catch(Exception e)
                {
    
                }
                return doc;
            }
        }

        private bool IsSameSized(IEnumerable<PhotoDocument> photoDocumentsCollection, PhotoDocument photo)
        {
            using (var webClient = new WebClient())
            {
                var newPhotoBlob = webClient.DownloadData($"{_blobUrl}{photo.BlobId}");
                return photoDocumentsCollection.Select(photoDocument => $"{_blobUrl}{photoDocument.BlobId}")
                    .Select(photoUrl => webClient.DownloadData(photoUrl)).Any(photoDocumentBlob =>
                        photoDocumentBlob.SequenceEqual(newPhotoBlob));
            }
        }
    }
}
