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
using System.Net.Http;
using System.Text;
using System.Threading;
using Microsoft.Extensions.Configuration;
using Nest;
using Newtonsoft.Json;
using Serilog;
using Services.Models;

namespace Photo.BusinessLogic.Services
{
	public class PhotoService : IPhotoService
	{
		private readonly IElasticStorage _elasticStorage;
		private readonly IPhotoBlobStorage _storage;
		private readonly IMessageService _messageService;
		private readonly IMapper _mapper;
		private readonly ImageCompareService _imageComporator;
		private readonly string _blobUrl;
		private readonly HttpClient _httpClient;
		private readonly IConfiguration _configuration;

		public PhotoService(
			IElasticStorage elasticStorage,
			IPhotoBlobStorage storage,
			IMessageService messageService,
			IMapper mapper,
			ImageCompareService imageComporator,
			string blobUrl,
			IConfiguration configuration)
		{
			_elasticStorage = elasticStorage;
			_storage = storage;
			_messageService = messageService;
			_mapper = mapper;
			_blobUrl = blobUrl;
			_imageComporator = imageComporator;
			_httpClient = new HttpClient();
			_configuration = configuration;
		}

		public Task<IEnumerable<PhotoDocument>> Find(int id, string criteria)
		{
			return _elasticStorage.Find(id, criteria);
		}

		public async Task<Dictionary<string, List<string>>> FindFields(int id, string criteria)
		{
			var resultingDictionary = await _elasticStorage.FindFields(id, criteria);
			for (var i = 0; i < resultingDictionary["thumbnails"].Count; i++)
			{
				resultingDictionary["thumbnails"][i] = await GetPhoto(resultingDictionary["thumbnails"][i]);
			}

			return resultingDictionary;
		}

		public async Task<List<byte[]>> GetPhotos(List<string> values)
		{
			return await _storage.GetPhotos(values);
		}

		public async Task<string> GetPhoto(string blobId)
		{
			return await _storage.GetPhoto(blobId);
		}

		public async Task<string> GetAvatar(string blobId)
		{
			return await _storage.GetAvatar(blobId);
		}

		public async Task<IEnumerable<PhotoDocument>> Get()
		{
			return await _elasticStorage.Get();
		}

		public Task<IEnumerable<PhotoDocument>> GetUserPhotos(int userId)
		{
			return _elasticStorage.GetUserPhotos(userId);
		}

		public async Task<int> CheckAuthorPhoto(Tuple<int, int> tuple)
		{
			return await _elasticStorage.CheckUserPhoto(tuple);
		}

		public async Task<PhotoDocument> Get(int elasticId)
		{
			return await _elasticStorage.Get(elasticId);
		}

		public async Task<IEnumerable<PhotoDocument>> GetManyByIds(IEnumerable<int> elasticIds)
		{
			var photos = new List<PhotoDocument>();
			foreach (var item in elasticIds)
			{
				photos.Add(await _elasticStorage.Get(item));
			}

			return photos;
		}

		public async Task<IEnumerable<PhotoDocument>> GetUserPhotosRange(int userId, int startId, int count)
		{
			return await _elasticStorage.GetUserPhotosRange(userId, startId, count);
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
			var models = new List<ImageToProcessDTO>();
			models.Add(new ImageToProcessDTO
			{
				ImageId = updatePhotoDTO.Id
			});
			_messageService.SendPhotoToThumbnailProcessor(models);
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

		public async Task SendDuplicates(List<int> duplicates)
		{
			var photos = new List<PhotoDocument>();
			foreach (var value in duplicates)
			{
				var photo = await _elasticStorage.Get(value);
				photos.Add(photo);
			}

			string uri = _configuration["LamaApiUrl"];
            var dto = _mapper.Map<IEnumerable<PhotoDocumentDTO>>(photos);

            StringContent content = new StringContent(JsonConvert.SerializeObject(dto), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await _httpClient.PostAsync(uri, content);

            string bodyJson = await response.Content.ReadAsStringAsync();
        }

		 public async Task<IEnumerable<PhotoDocumentDTO>> FindSimilarPhotos(int photoId)
        {
            var hash = new List<ImgHash>();
            var photo = await _elasticStorage.Get(photoId);
            var comparisonResult = await _imageComporator.FindDuplicatesWithTollerance(photo.UserId, Convert.ToInt32(_configuration["minSimilarity"]));
            foreach (var item in comparisonResult)
            {
                if (item.Count <= 0) continue;
                if (item.Select(i => i.PhotoId).Contains(photoId))
                {
                    hash = item;
                    break;
                }
            }
            hash.Remove(hash.FirstOrDefault(i => i.PhotoId == photoId));
            var result = new List<PhotoDocumentDTO>();
            foreach (var item in hash)
            {
                var photoDoc = await _elasticStorage.Get((int)item.PhotoId);
                var photoDocDto = _mapper.Map<PhotoDocumentDTO>(photoDoc);
                result.Add(photoDocDto);
            }
            return result;
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
                var r = await Create(mappedToPhotoDocument);
				Log.Logger.Information(r.ToString());
				Log.Logger.Information(
					$"{Environment.NewLine}{r.IsValid}{Environment.NewLine}{r.OriginalException}{Environment.NewLine}{r.Result}{Environment.NewLine}{r.ServerError}");
                createdDuplicates.Add(_mapper.Map<CreatePhotoResultDTO>(mappedToPhotoDocument));
                
            }
            var models = new List<ImageToProcessDTO>();
            foreach (var item in duplicates)
            {
                models.Add(new ImageToProcessDTO
                {
                    ImageId = item.Id,
                    UserId = item.UserId
                });
            }
            _messageService.SendPhotoToThumbnailProcessor(models);

            return createdDuplicates;
        }

        public async Task<IEnumerable<CreatePhotoResultDTO>> FindDuplicates(int userId)
        {
            var comparisionResult = await _imageComporator.FindDuplicatesWithTollerance(userId, 100);
            var duplicates = new List<CreatePhotoResultDTO>();
            foreach (var item in comparisionResult)
            {
                if (item.Count <= 1) continue;
                foreach (var imgHash in item)
                {
                    var photo = await _elasticStorage.Get((int)imgHash.PhotoId);
                    var mappedPhoto = _mapper.Map<CreatePhotoResultDTO>(photo);
                    duplicates.Add(mappedPhoto);
                }
                duplicates.Remove(duplicates.LastOrDefault());
            }
            return duplicates;
        }

        public async Task<IEnumerable<CreatePhotoResultDTO>> Create(IEnumerable<CreatePhotoDTO> items)
        {
            var createdPhotos = new List<CreatePhotoResultDTO>();
            foreach (var item in items)
            {
                var base64 = ConvertToBase64(item.ImageUrl);
                var blob = Convert.FromBase64String(base64);
                var blobId = await _storage.LoadPhotoToBlob(blob);
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
            }

            var models = new List<ImageToProcessDTO>();
            foreach (var item in items)
            {
                models.Add(new ImageToProcessDTO
                {
                    ImageId = item.Id,
                    UserId = item.AuthorId
                });
            }

            _messageService.SendPhotoToThumbnailProcessor(models);
            return createdPhotos;
        }

        public async Task<string> CreateAvatar(CreatePhotoDTO item)
        {
            var base64 = ConvertToBase64(item.ImageUrl);
            var blob = Convert.FromBase64String(base64);
            var blobId = await _storage.LoadAvatarToBlob(blob);
            return blobId;
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
                catch (Exception)
                {
                    // ignored
                }

                return doc;
            }
        }
    }
}
