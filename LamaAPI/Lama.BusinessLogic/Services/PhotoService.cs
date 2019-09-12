using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Lama.Domain.BlobModels;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess.Interfaces;
using Lama.Domain.DbModels;
using System.Linq;
using Lama.Domain.DTO.Photo;
using AutoMapper;
using Lama.Domain.DTO.Reaction;
using Microsoft.AspNetCore.SignalR;
using Lama.BusinessLogic.Hubs;
using Lama.DataAccess;
using Lama.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Newtonsoft.Json.Serialization;

namespace Lama.BusinessLogic.Services
{
    public class PhotoService : IPhotoService, IDisposable
    {
        private readonly string _url;
        private readonly IUnitOfWork _unitOfWorkContext;
        private readonly HttpClient _httpClient;
        private readonly IMapper _mapper;
        private readonly INotificationService _notificationService;
        private readonly ApplicationDbContext _dbContext;
        private readonly IHubContext<NotificationHub> _hub;
        private readonly ILocationService _locationService;

        public PhotoService(ApplicationDbContext dbContext, string url, IUnitOfWork unitOfWorkContext, IMapper mapper, INotificationService notificationService, ILocationService locationService, IHubContext<NotificationHub> hub)
        {
            _url = url;
            _unitOfWorkContext = unitOfWorkContext;
            _httpClient = new HttpClient();
            _mapper = mapper;
            _dbContext = dbContext;
            _notificationService = notificationService;
            _locationService = locationService;
            _hub = hub;
        }


        public void Dispose()
        {
            _httpClient.Dispose();
        }
        public async Task<IEnumerable<string>> GetHistory(int userId)
        {
            var history = await _unitOfWorkContext.GetRepository<SearchHistory>().GetAsync(h => h.UserId == userId);
            return history.Reverse()
                .GroupBy(h => h.Text)
                .Take(5)
                .Select(h => h.Take(5)
                    .First())
                .ToList()
                .Select(h => h.Text)
                .Distinct();
        }
        public async Task<IEnumerable<PhotoDocumentDTO>> FindPhoto(int id, string criteria)
        {

            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/search/{id}/{criteria}");

            var responseContent = await response.Content.ReadAsStringAsync();

            var photoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photoDocumentDTOs = _mapper.Map<IEnumerable<PhotoDocumentDTO>>(photoDocuments);

            foreach (var photoDocumentDto in photoDocumentDTOs)
            {
                var likes =  (await _unitOfWorkContext.GetRepository<Like>()
                    .GetAsync(l => l.PhotoId == photoDocumentDto.Id))


                    .ToArray();

                photoDocumentDto.Reactions = _mapper.Map<LikeDTO[]>(likes);

                foreach (var like in photoDocumentDto.Reactions)
                {
                    if (like.Photo != null)
                    {
                        like.Photo.Likes = null;
                    }
                }
            }
            await _unitOfWorkContext.GetRepository<SearchHistory>().InsertAsync(new SearchHistory
            {
                Text = criteria,
                UserId = id,
                SearchDate = DateTime.Now
            });
            await _unitOfWorkContext.SaveAsync();

            return photoDocumentDTOs;
        }

        public async Task<Dictionary<string, List<string>>> FindFields(int id, string criteria)
        {

            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/search/fields/{id}/{criteria}");

            var responseContent = await response.Content.ReadAsStringAsync();


            return JsonConvert.DeserializeObject<Dictionary<string, List<string>>>(responseContent);
        }

        public Task<int> Create(PhotoDocument item)
        {
            throw new NotImplementedException();
        }
        public async Task<int> AddReaction(NewLikeDTO newLike)
        {
            var like = _mapper.Map<Like>(newLike);
            await _unitOfWorkContext.GetRepository<Like>().InsertAsync(like);
            await _unitOfWorkContext.SaveAsync();

            var photo = await _dbContext.Photos.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == newLike.PhotoId);
            var user = photo.User;
            var id = user.Id;
            if (user.Id == newLike.UserId) return like.Id;
            {
                user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Id == newLike.UserId);
                const string notification = "Liked your photo";
                await _notificationService.SendNotification(id, user, notification, ActivityType.Like, new List<int>() {photo.Id});
            }
            return like.Id;
        }
        public async Task RemoveReaction(NewLikeDTO removeLike)
        {
            var collect = await _unitOfWorkContext.GetRepository<Like>().GetAsync();
            var like = collect.FirstOrDefault(x => x.PhotoId == removeLike.PhotoId && x.UserId == removeLike.UserId);
            _unitOfWorkContext.GetRepository<Like>().Delete(like);
            await _unitOfWorkContext.SaveAsync();
        }

        public async Task<IEnumerable<UploadPhotoResultDTO>> CreateAll(CreatePhotoDTO[] photos)
        {
            var savedPhotos = new Photo[photos.Length];
            for (var i = 0; i < photos.Length; ++i)
            {
                var photo = new Photo();
                var user = await _unitOfWorkContext.GetRepository<User>().GetAsync(photos[i].AuthorId);
                photo.User = user;
                photo.UserId = photos[i].AuthorId;

                if (photos[i].ShortLocation != null)
                {
                    photo.LocationId = await _locationService.CheckAdrress(photos[i].ShortLocation);
                }
                savedPhotos[i] = await _unitOfWorkContext.GetRepository<Photo>().InsertAsync(photo);
            }

            await _unitOfWorkContext.SaveAsync();

            var users = await _unitOfWorkContext.GetRepository<Photo>().GetAsync();

            // modify photos with ids
            for (int i = 0; i < photos.Length; ++i)
            {
                photos[i].Id = savedPhotos[i].Id;
            }

            // send photos to Photo project
            var content = new StringContent(JsonConvert.SerializeObject(photos), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"{_url}api/photos", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            var converted = JsonConvert.DeserializeObject<IEnumerable<UploadPhotoResultDTO>>(responseContent);
            var uploadPhotoResultDtos = converted.ToList();
            foreach (var photo in uploadPhotoResultDtos)
            {
                photo.Reactions = new Like[0];
            }

            return uploadPhotoResultDtos;
        }

        public async Task<IEnumerable<UploadPhotoResultDTO>> CreateDuplicates(UploadPhotoResultDTO[] duplicates)
        {
            var content = new StringContent(JsonConvert.SerializeObject(duplicates), Encoding.UTF8, "application/json");
            var response = await _httpClient.PostAsync($"{_url}api/photos/duplicates", content);
            var responseContent = await response.Content.ReadAsStringAsync();
            var converted = JsonConvert.DeserializeObject<IEnumerable<UploadPhotoResultDTO>>(responseContent);
            return converted;
        }

        public async Task<Photo> Create(CreatePhotoDTO item)
        {
            var insertedPhoto = (await _unitOfWorkContext.GetRepository<Photo>().InsertAsync(new Photo()));
            await _unitOfWorkContext.SaveAsync();

            // send request to Photo
            item.Id = insertedPhoto.Id;

            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await _httpClient.PostAsJsonAsync($"{_url}api/photos", item);

            return response.IsSuccessStatusCode ? insertedPhoto : null;
        }

        public async Task<string> CreateAvatar(CreatePhotoDTO item)
        {
            var user = await _unitOfWorkContext.GetRepository<User>().GetAsync(item.AuthorId);
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await _httpClient.PostAsJsonAsync($"{_url}api/photos/avatar", item);
            var content = await response.Content.ReadAsStringAsync();
            user.AvatarUrl = JsonConvert.DeserializeObject<string>(content);
            await _unitOfWorkContext.SaveAsync();
            return user.AvatarUrl;
        }

        public async Task<UpdatedPhotoResultDTO> UpdatePhoto(UpdatePhotoDTO updatePhotoDTO)
        {
            var uri = $"{_url}api/photos";

            var content = new StringContent(JsonConvert.SerializeObject(updatePhotoDTO), Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync(uri, content);

            var bodyJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<UpdatedPhotoResultDTO>(bodyJson);

        }

        public async Task<IEnumerable<PhotoDocumentDTO>> GetSimilarPhotos(int id)
        {
            var uri = $"{_url}api/photos/similar/{id}";
            var response = await _httpClient.GetAsync(uri);
            var bodyJson = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<IEnumerable<PhotoDocumentDTO>>(bodyJson);
        }

        public async Task SendDuplicates(IEnumerable<int> photos)
        {
            Log.Logger.Information("Duplicates received on LamaAPI");
            var photosList = photos.ToList();
            var userId = (await _unitOfWorkContext.GetRepository<Photo>().GetAsync(photosList.FirstOrDefault())).UserId;
            await _notificationService.SendNotification(userId, null, "Duplicates found", ActivityType.Duplicates, photosList);

        }

        #region GET
        public async Task<IEnumerable<PhotoDocumentDTO>> GetAll()
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos");

            var responseContent = await response.Content.ReadAsStringAsync();

            var photoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photos = _mapper.Map<List<PhotoDocumentDTO>>(photoDocuments);

            if (photos == null)
            {
                return null;
            }

            for (var i = 0; i < photos.Count(); i++)
            {
                var getLike = await _unitOfWorkContext.GetRepository<Like>().GetAsync(x => x.PhotoId == photos[i].Id);
                photos[i].Reactions = _mapper.Map<IEnumerable<LikeDTO>>(getLike);
            }
            return photos;
        }

        public async Task<IEnumerable<UploadPhotoResultDTO>> GetDuplicates(int userId)
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/duplicates/{userId}");

            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<IEnumerable<UploadPhotoResultDTO>>(responseContent);
        }

        public async Task<string> GetPhoto(string blobId)
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/images/{blobId}");

            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<string>(responseContent);
        }

        public async Task<string> GetAvatar(string blobId)
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/avatars/{blobId}");

            var responseContent = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<string>(responseContent);
        }

        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserPhotos(int id)
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await _httpClient.GetAsync($"{_url}api/photos/user/{id}");

            var responseContent = await response.Content.ReadAsStringAsync();

            var photoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photos = _mapper.Map<List<PhotoDocumentDTO>>(photoDocuments);

            for (var i = 0; i < photos.Count(); i++)
            {
                var like = await _unitOfWorkContext.GetRepository<Like>().GetAsync(x => x.PhotoId == photos[i].Id);
                photos[i].Reactions = _mapper.Map<IEnumerable<LikeDTO>>(like);
            }
            return photos;
        }

        public async Task<PhotoDocumentDTO> Get(int id)
        {
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            var response = await _httpClient.GetAsync($"{_url}api/photos/{id}");
            var responseContent = await response.Content.ReadAsStringAsync();
            var photo =  JsonConvert.DeserializeObject<PhotoDocument>(responseContent);
            var likes = _dbContext.Likes.Where(l => l.PhotoId == photo.Id);
            var photoDto = _mapper.Map<PhotoDocumentDTO>(photo);
            photoDto.Reactions = _mapper.Map<IEnumerable<LikeDTO>>(likes);
            return photoDto;
        }

        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserPhotosRange(int userId, int startId, int count)
        {
            var countPhotos = await _unitOfWorkContext.GetRepository<Photo>().CountAsync(x => x.User.Id == userId);
            _httpClient.DefaultRequestHeaders.Add("userId", $"{userId}");
            _httpClient.DefaultRequestHeaders.Add("startId", $"{startId}");
            _httpClient.DefaultRequestHeaders.Add("count", $"{count}");

            var response = await _httpClient.GetAsync($"{_url}api/photos/rangeUserPhotos");

            var responseContent = await response.Content.ReadAsStringAsync();

            var photoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            var photos = _mapper.Map<List<PhotoDocumentDTO>>(photoDocuments);

            for (var i = 0; i < photos.Count(); i++)
            {
                var like = await _unitOfWorkContext.GetRepository<Like>().GetAsync(x => x.PhotoId == photos[i].Id);
                photos[i].Reactions = _mapper.Map<IEnumerable<LikeDTO>>(like);
            }
            return photos;
        }

        public async Task SetPhotoCategory(string photoData)
        {
            var deserializedPhotoData = JsonConvert.DeserializeObject<List<Tuple<int,long, string>>>(photoData);
            foreach (var (userId, photoId, category) in deserializedPhotoData)
            {
                var categoryId = await ProcessPhotoCategoryAsync(userId, category);
                var foundPhoto = await _dbContext.Photos.FirstOrDefaultAsync(photo => photo.Id == photoId);
                if (foundPhoto != null)
                {
                    foundPhoto.CategoryId = categoryId;
                }

                await _dbContext.SaveChangesAsync();
            }
        }
        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserCategory(string value,int UserId)
        {
            var photoDocuments = new List<PhotoDocumentDTO>();
            var category = await _dbContext.Categories.FirstOrDefaultAsync(x => x.Name == value && x.UserId == UserId);
            if(category!=null)
            {
                var photoIds = _dbContext.Photos.Where(photo => photo.CategoryId == category.Id && photo.UserId == UserId).Select(x => x.Id);
                foreach (var id in photoIds)
                {
                    var photoDoc = await Get(id);
                    if (photoDoc.IsDeleted == false)
                    {
                        photoDocuments.Add(photoDoc);
                    }
                }
            }
            return photoDocuments;
        }
        public async Task<IEnumerable<PhotoCategoryDTO>> GetUserPhotosCategorized(int userId)
        {
            var top5Categories = _dbContext.Categories.Where(category => category.UserId == userId).ToList().OrderByDescending(category => category.Count).Take(5);
            var top5CategoriesWithPhotos = new List<PhotoCategoryDTO>();
            var categories = top5Categories.ToList();
            if (!categories.Any()) return top5CategoriesWithPhotos;
            foreach (var category in categories)
            {
                var photoDocuments = new List<PhotoDocumentDTO>();
                var photoIds = _dbContext.Photos.Where(photo => photo.CategoryId == category.Id && photo.UserId == userId).Select(x => x.Id);
                foreach (var id in photoIds)
                {
                    var photoDoc = await Get(id);
                    if (photoDoc.IsDeleted == false)
                    {
                        photoDocuments.Add(_mapper.Map<PhotoDocumentDTO>(photoDoc));
                    }
                }
                top5CategoriesWithPhotos.Add(new PhotoCategoryDTO{Category = category.Name, Photos = photoDocuments});
            }
            return top5CategoriesWithPhotos;
        }

        private async Task<int> ProcessPhotoCategoryAsync(int currentUserId, string category)
        {
            var existingCategory = await _dbContext.Categories.FirstOrDefaultAsync(existing => existing.Name == category);
            if (existingCategory == null)
            {
                _dbContext.Categories.Add(new Category
                {
                    Name = category,
                    Count = 1,
                    UserId = currentUserId
                });
                
                await _dbContext.SaveChangesAsync();
            }
            else
            {
                existingCategory.Count++;
                await _dbContext.SaveChangesAsync();
            }

            var addedCategory = await _dbContext.Categories.FirstAsync(cat => cat.Name == category);

            return addedCategory.Id;
        }

        #endregion

        #region DELETE
        public Task MarkPhotoAsDeleted(int photoToDeleteId)
        {
            var uri = $"{_url}api/photos/{photoToDeleteId}";
            RemoveFromCategoriesListById(photoToDeleteId);

            return _httpClient.DeleteAsync(uri);
        }
        public async Task<DeletedPhotoDTO[]> GetDeletedPhotos(int userId)
        {
            var uri = $"{_url}api/photos/deleted/{userId}";

            var response = await _httpClient.GetAsync(uri);

            var bodyJson = await response.Content.ReadAsStringAsync();

            return JsonConvert.DeserializeObject<DeletedPhotoDTO[]>(bodyJson);
        }

        public async Task DeletePhotosPermanently(PhotoToDeleteRestoreDTO[] photosToDelete)
        {
            var uri = $"{_url}api/photos/delete_permanently";

            var content = new StringContent(JsonConvert.SerializeObject(photosToDelete), Encoding.UTF8, "application/json");

            await _httpClient.PostAsync(uri, content);

            Photo haveLocation = null;
            var locationId = 0;
            foreach (var photoToDelete in photosToDelete)
            {
                var phots = _dbContext.PhotoAlbums.Where(x => x.PhotoId == photoToDelete.Id);
                _dbContext.PhotoAlbums.RemoveRange(phots);
                await _dbContext.SaveChangesAsync();

                var haveCover  = _dbContext.Albums.Where(x => x.CoverId == photoToDelete.Id);
                if(haveCover.Count() != 0)
                {
                    foreach(var item in haveCover)
                    {
                        item.CoverId = null;
                        item.Photo = null;
                    }
                    _dbContext.Albums.UpdateRange(haveCover);
                    await _dbContext.SaveChangesAsync();
                }

                var photo = await _dbContext.Photos.FirstOrDefaultAsync(x => x.Id == photoToDelete.Id);
                if(photo.LocationId.HasValue)
                {
                    locationId = photo.LocationId.Value;
                }
                await _unitOfWorkContext.GetRepository<Photo>().DeleteAsync(photoToDelete.Id);
            }

            await _unitOfWorkContext.SaveAsync();
            haveLocation = await _dbContext.Photos.FirstOrDefaultAsync(x => x.LocationId == locationId);
            if (haveLocation == null)
            {
                if (locationId != 0)
                {
                    await _locationService.DeleteLocation(locationId);
                }
            }              
               
        }        

        public async Task<Task<HttpResponseMessage>> RestoresDeletedPhotos(int userId,
            PhotoToDeleteRestoreDTO[] photosToRestore)
        {
            var uri = $"{_url}api/photos/restore";

            var content = new StringContent(JsonConvert.SerializeObject(photosToRestore), Encoding.UTF8, "application/json");
            await RestoreCategoryIfNeeded(userId, photosToRestore);

            return _httpClient.PostAsync(uri, content);
        }

        private async Task RestoreCategoryIfNeeded(int userId, IEnumerable<PhotoToDeleteRestoreDTO> photosToRestore)
        {
            foreach (var photo in photosToRestore)
            {
                var photoDoc = await Get(photo.Id);
                var photoCategory = await _dbContext.Categories.FirstOrDefaultAsync(category => category.Name == photoDoc.Category && category.UserId == userId);
                var foundPhoto = await _dbContext.Photos.FirstOrDefaultAsync(pht => pht.Id == photo.Id);
                if (photoCategory == null)
                {
                    _dbContext.Categories.Add(new Category
                    {
                        Name = photoDoc.Category,
                        Count = 1,
                        UserId = userId
                    });
                    await _dbContext.SaveChangesAsync();
                    var createdCategory = await _dbContext.Categories.FirstOrDefaultAsync(category => category.Name == photoDoc.Category &&
                                                                                                                category.UserId == userId);
                    foundPhoto.CategoryId = createdCategory.Id;
                    await _dbContext.SaveChangesAsync();
                }
                else
                {
                    if (foundPhoto != null)
                    {
                        foundPhoto.CategoryId = photoCategory.Id;
                        photoCategory.Count += 1;
                    }
                    await _dbContext.SaveChangesAsync();
                 }
                
            }
        }

        #endregion

        private async Task RemoveFromCategoriesListById(int photoToDeleteId)
        {
            var deletingPhoto = await _dbContext.Photos.FirstOrDefaultAsync(photo => photo.Id == photoToDeleteId);
            if (deletingPhoto == null) return;
            var photoCategory =
                await _dbContext.Categories.FirstOrDefaultAsync(category => category.Id == deletingPhoto.CategoryId);
            if(photoCategory == null) return;
            switch (photoCategory.Count)
            {
                case 0:
                    return;
                case 1:
                    _dbContext.Categories.Remove(photoCategory);
                    await _dbContext.SaveChangesAsync();
                    break;
                default:
                    photoCategory.Count -= 1;
                    await _dbContext.SaveChangesAsync();
                    break;
            }
        }
    }
}
