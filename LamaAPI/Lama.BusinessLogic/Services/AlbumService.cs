using AutoMapper;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Lama.DataAccess.Interfaces;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Photo;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;

using System.Threading.Tasks;

using Lama.BusinessLogic.Exceptions;
using Lama.Domain.DTO;
using Lama.Domain.DTO.Album;
using Lama.Domain.DTO.Reaction;
using System.Threading;
using System.Net.Http.Headers;
using Lama.Domain.DTO.User;
using Serilog;

namespace Lama.BusinessLogic.Services
{
    public class AlbumService : BaseService<Album>, IAlbumService
    {
        private readonly IPhotoService _photoService;
        private IUnitOfWork _context;
        IConfiguration configuration;
        private readonly IMapper _mapper;
        ILocationService locationService;
        public AlbumService(ApplicationDbContext Context, IConfiguration configuration, IPhotoService _photoService, IUnitOfWork context, IMapper _mapper, ILocationService locationService)
            : base(Context)
        {
            this._photoService = _photoService;
            this._context = context;
            this.configuration = configuration;
            this._context = context;
            this._mapper = _mapper;
            this.locationService = locationService;
        }

        public async Task UpdateAlbum(UpdateAlbumDTO album)
        {

            var photoAlbums = Context.PhotoAlbums.Where(i => i.AlbumId == album.Id);
            var ids = photoAlbums.Select(i => i.PhotoId).ToList();
            var removedIds = ids.Except(album.PhotoIds);
            var removedPhotoAlbums = removedIds.Select(item => photoAlbums.FirstOrDefault(i => i.PhotoId == item)).ToList();
            Context.PhotoAlbums.RemoveRange(removedPhotoAlbums);
            await Context.SaveChangesAsync();
            
        }

        public async Task<int?> UpdateCover(UpdateAlbumDTO album)
        {
            var albumToUpdate = await Context.Albums.FindAsync(album.Id);

            if (albumToUpdate.CoverId != album.CoverId)
            {
                albumToUpdate.CoverId = album.CoverId;
            }

            await Context.SaveChangesAsync();

            return albumToUpdate.CoverId;
        }

        public async Task<int> CreateEmptyAlbum(NewAlbumDTO albumDto)
        {
            var user = await Context.Users.FirstOrDefaultAsync(x => x.Id == albumDto.AuthorId);

            var TempAlbum = new Album()
            {
                Title = albumDto.Title,
                User = user
            };
            await Context.Albums.AddAsync(TempAlbum);
            await Context.SaveChangesAsync();

            return TempAlbum.Id;
        }
        
        public async Task<List<PhotoDocumentDTO>> AddExistPhotosToAlbum(ExistPhotosAlbum existPhotosAlbum)
        {
            List<int> returnIdPhotos = new List<int>();
            List<PhotoAlbum> photoAlbums = new List<PhotoAlbum>();
            foreach (var photoId in existPhotosAlbum.PhotosId)
            {
                var search = await Context.PhotoAlbums.FirstOrDefaultAsync(x => x.AlbumId == existPhotosAlbum.AlbumId && x.PhotoId == photoId);
                if (search == null)
                {
                    var dbPhoto = new PhotoAlbum() { AlbumId = existPhotosAlbum.AlbumId, PhotoId = photoId };
                    photoAlbums.Add(dbPhoto);
                    returnIdPhotos.Add(photoId);
                }
            }
            await Context.PhotoAlbums.AddRangeAsync(photoAlbums);
            await Context.SaveChangesAsync();

            string url = configuration["PhotoApiUrl"];

            List<PhotoDocumentDTO> photos = new List<PhotoDocumentDTO>();
            using (HttpClient httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await httpClient.GetAsync($"{url}api/photos");

                var responseContent = await response.Content.ReadAsStringAsync();

                var PhotoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
                photos = _mapper.Map<List<PhotoDocumentDTO>>(PhotoDocuments);
            }
            var ReturnPhotos = new List<PhotoDocumentDTO>();

            foreach (var id in returnIdPhotos)
            {
                var Photo = photos.FirstOrDefault(x => x.Id == id);
                var getLike = await _context.GetRepository<Like>().GetAsync(x => x.PhotoId == id);
                Photo.Reactions = _mapper.Map<IEnumerable<LikeDTO>>(getLike);
                if (Photo != null)
                {
                    ReturnPhotos.Add(Photo);
                }
            }

            var album = await Context.Albums.FirstOrDefaultAsync(x => x.Id == existPhotosAlbum.AlbumId);
            if (album.Photo == null && ReturnPhotos.Count() != 0)
            {
                album.CoverId = ReturnPhotos[0].Id;
                Context.Albums.Update(album);
                await Context.SaveChangesAsync();
            }

            return ReturnPhotos;
        }
        
        public async Task<List<PhotoDocumentDTO>> AddNewPhotosToAlbum(NewPhotosAlbum newPhotosAlbum)
        {
            string url = configuration["PhotoApiUrl"];
            var PhotosAlbum = newPhotosAlbum.Photos;

            Photo[] savedPhotos = new Photo[PhotosAlbum.Length];
            var user = await Context.Users.FirstOrDefaultAsync(x => x.Id == newPhotosAlbum.UserId);
            for (int i = 0; i < PhotosAlbum.Length; i++)
            {
                var photo = new Photo();
                photo.User = user;
                if (PhotosAlbum[i].ShortLocation != null)
                {
                    photo.LocationId = await locationService.CheckAdrress(PhotosAlbum[i].ShortLocation);
                }
                savedPhotos[i] = await _context.GetRepository<Photo>().InsertAsync(photo);
            }
            await _context.SaveAsync();

            CreatePhotoDTO[] PhotosToCreate = new CreatePhotoDTO[PhotosAlbum.Length];

            for (int i = 0; i < PhotosToCreate.Length; ++i)
            {
                PhotosToCreate[i] = new CreatePhotoDTO()
                {
                    Id = savedPhotos[i].Id,
                    AuthorId = newPhotosAlbum.UserId,
                    ImageUrl = PhotosAlbum[i].ImageUrl,
                    Description = PhotosAlbum[i].Description,
                    FileName = PhotosAlbum[i].FileName,
                    Location = PhotosAlbum[i].Location,
                    Coordinates = PhotosAlbum[i].Coordinates
                };
            }

            List<PhotoAlbum> photoAlbums = new List<PhotoAlbum>();
            for (int i = 0; i < savedPhotos.Length; i++)
            {
                photoAlbums.Add(new PhotoAlbum() { Photo = savedPhotos[i], AlbumId = newPhotosAlbum.AlbumId });
            }
            await Context.PhotoAlbums.AddRangeAsync(photoAlbums);
            await Context.SaveChangesAsync();

            var album = await Context.Albums.FirstOrDefaultAsync(x => x.Id == newPhotosAlbum.AlbumId);
            if (album.Photo == null && savedPhotos.Count() != 0)
            {
                album.Photo = savedPhotos[0];
                Context.Albums.Update(album);
                await Context.SaveChangesAsync();
            }

            List<PhotoDocument> list = new List<PhotoDocument>();
            using (HttpClient httpClient = new HttpClient())
            {
                var s = await httpClient.PostAsJsonAsync($"{url}api/photos", PhotosToCreate);
                var str = await s.Content.ReadAsStringAsync();
                list = JsonConvert.DeserializeObject<List<PhotoDocument>>(str);
            }
            var photos = _mapper.Map<List<PhotoDocumentDTO>>(list);
            foreach(var item in photos)
            {
                item.Reactions = new List<LikeDTO>();   
            }
            return photos;
        }
        
        public async Task<ReturnAlbumDTO> CreateAlbumWithNewPhotos(NewAlbumDTO albumDto)
        {
            var url = configuration["PhotoApiUrl"];
            var PhotosAlbum = albumDto.Photos;


            var savedPhotos = new Photo[PhotosAlbum.Length];

            var user = await Context.Users.FirstOrDefaultAsync(x => x.Id == albumDto.AuthorId);

            var TempAlbum = new Album()
            {
                Title = albumDto.Title,
                User = user
            };

            for (var i = 0; i < PhotosAlbum.Length; ++i)
            {
                var photo = new Photo();
                photo.User = user;
                if (PhotosAlbum[i].ShortLocation != null)
                {
                    photo.LocationId = await locationService.CheckAdrress(PhotosAlbum[i].ShortLocation);
                }
                savedPhotos[i] = await _context.GetRepository<Photo>().InsertAsync(photo);
            }
            await _context.SaveAsync();


            var photosToCreate = new CreatePhotoDTO[PhotosAlbum.Length];

            for (var i = 0; i < photosToCreate.Length; ++i)
            {
                photosToCreate[i] = new CreatePhotoDTO()
                {
                    Id = savedPhotos[i].Id,
                    AuthorId = user.Id,
                    ImageUrl = PhotosAlbum[i].ImageUrl,
                    Description = PhotosAlbum[i].Description,
                    FileName = PhotosAlbum[i].FileName,
                    Location = PhotosAlbum[i].Location,
                    Coordinates = PhotosAlbum[i].Coordinates
                };
            }
            
            var photoAlbums = savedPhotos.Select(photo => new PhotoAlbum() {Photo = photo, Album = TempAlbum}).ToList();

            if (savedPhotos.Length != 0)
            {
                TempAlbum.Photo = savedPhotos[0];
                TempAlbum.PhotoAlbums = photoAlbums;
            }


            IEnumerable<UploadPhotoResultDTO> photos;
            using (var httpClient = new HttpClient())
            {
                var s = await httpClient.PostAsJsonAsync($"{url}api/photos", photosToCreate);
                var str = await s.Content.ReadAsStringAsync();
                photos = JsonConvert.DeserializeObject<IEnumerable<UploadPhotoResultDTO>>(str);
            }


            var list = _mapper.Map<List<PhotoDocumentDTO>>(photos);
            var album = await Context.Albums.AddAsync(TempAlbum);
            await Context.SaveChangesAsync();

            foreach(var item in list)
            {
                item.Reactions = new List<LikeDTO>();
            }
            
            var Album = new ReturnAlbumDTO()
            {
                Id = album.Entity.Id,
                Title = album.Entity.Title
            };
            if (photos == null) return Album;
            Album.Photo = list[0];
            Album.PhotoAlbums = list;
            return Album;
        }
        
        public async Task<ReturnAlbumDTO> CreateAlbumWithExistPhotos(AlbumWithExistPhotosDTO album)
        {
            var user = await Context.Users.FirstOrDefaultAsync(x => x.Id == album.AuthorId);
            var TempAlbum = new Album()
            {
                Title = album.Title,
                User = user
            };

            var photoAlbums = new List<PhotoAlbum>();
            var photos = new List<Photo>();

            for (int i = 0; i < album.PhotosId.Length; i++)
            {
                var TempPhoto = await Context.Photos.FirstOrDefaultAsync(x => x.Id == album.PhotosId[i]);
                if (TempPhoto != null)
                {
                    photos.Add(TempPhoto);
                    photoAlbums.Add(new PhotoAlbum() { Photo = TempPhoto, Album = TempAlbum });
                }
            }
            if (photos.Count != 0)
            {
                TempAlbum.Photo = photos[0];
                TempAlbum.PhotoAlbums = photoAlbums;
            }


            var BdAlbum = await Context.Albums.AddAsync(TempAlbum);
            await Context.SaveChangesAsync();

            var url = configuration["PhotoApiUrl"];
            var Getphotos = new List<PhotoDocumentDTO>();
            using (var httpClient = new HttpClient())
            {
                httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await httpClient.GetAsync($"{url}api/photos");

                var responseContent = await response.Content.ReadAsStringAsync();

                var PhotoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
                Getphotos = _mapper.Map<List<PhotoDocumentDTO>>(PhotoDocuments);
            }

            var returnPhotos = album.PhotosId.Select(id => Getphotos.FirstOrDefault(x => x.Id == id)).Where(photo => photo != null).ToList();
            foreach (var item in returnPhotos)
            {
                item.Reactions = new List<LikeDTO>();
            }
            Log.Logger.Error($"{BdAlbum.Entity.Id}, {BdAlbum.Entity.Title}, {returnPhotos[0]}");
            
            var Album = new ReturnAlbumDTO
            {
                Id = BdAlbum.Entity.Id,
                Title = BdAlbum.Entity.Title,
                Photo = returnPhotos[0],
                PhotoAlbums = returnPhotos
            };
            return Album;

        }
        public async Task<List<ReturnAlbumDTO>> FindAll(int UserId)
        {
            var result = await Context.Albums
                .Include(u => u.User)
                .Include(t => t.PhotoAlbums)
                 .ThenInclude(x => x.Photo)
                .Include(x => x.Photo)
                .Where(x => x.UserId == UserId).ToListAsync();

            var ListOfPhotos = _mapper.Map<IEnumerable<PhotoDocument>>(await _photoService.GetAll());


            var albums = new List<ReturnAlbumDTO>();
            foreach (var item in result)
            {

                var Photos = from pa in item.PhotoAlbums
                             join el in ListOfPhotos on pa.Photo.Id equals el.Id
                             select el;

                var album = new ReturnAlbumDTO()
                {
                    Id = item.Id,
                    Title = item.Title,
                    User = _mapper.Map<UserDTO>(item.User)
                };
                var AlbumPhotos = _mapper.Map<PhotoDocumentDTO[]>(Photos);
                if (item.Photo != null)
                {
                   album.Photo = _mapper.Map<PhotoDocumentDTO>(ListOfPhotos.FirstOrDefault(x => x.Id == item.Photo.Id));
                   album.PhotoAlbums = _mapper.Map<PhotoDocumentDTO[]>(Photos);
                }
                albums.Add(album);
            }
            return albums;
        }
        public async Task<List<byte[]>> GetPhotos(List<string> photoDocuments)
        {
            var url = configuration["PhotoApiUrl"];
            using (var httpClient = new HttpClient())
            {
                return JsonConvert.DeserializeObject<List<Byte[]>>(
                    await
                    (await httpClient.PostAsJsonAsync($"{url}api/photos/ArchivePhotos", photoDocuments)).Content.ReadAsStringAsync());
            }
        }

        public async Task<List<AlbumPhotoDetails>> GetAlbumPhotoDetails(int id)
        {

            List<AlbumPhotoDetails> list = new List<AlbumPhotoDetails>();
            var albums = await Context.PhotoAlbums.Include(x => x.Photo).Include(x => x.Album).Where(x => x.Photo.Id == id).Select(x => x.Album).ToListAsync();
            foreach (var album in albums)
            {
                var photo = new PhotoAlbumDetails();
                var Document = await _photoService.Get(album.CoverId.Value);
                if (Document != null)
                {
                    string image = Document.BlobId.Substring(7);
                    var tempohoto = await _photoService.GetPhoto(image);
                     photo = new PhotoAlbumDetails() { ImageUrl = tempohoto };
                }
                var returnAlbum = _mapper.Map<AlbumPhotoDetails>(album);
                returnAlbum.Photo = photo;

                list.Add(returnAlbum);
            }


            return list;
        }
        public async Task<int> RemoveAlbum(int id)
        {
            var albumToDelete = await Context.Albums.FindAsync(id);
            if (albumToDelete == null)
            {
                throw new NotFoundException(nameof(Album), id);
            }

            UnbindEntitiesFromAlbum(albumToDelete);
            Context.Albums.Remove(albumToDelete);
            await Context.SaveChangesAsync();
            return id;
        }

        public async Task<int> RemoveAlbumCover(int id)
        {
            var album = await Context.Albums.FindAsync(id);
            album.CoverId = null;
            return await Context.SaveChangesAsync();
        }

        public async Task<ReturnAlbumDTO> FindAlbum(int Id)
        {
            var result = await Context.Albums
                .Include(t => t.PhotoAlbums)
                .Include(u => u.User)
                .Include(x => x.Photo)
                .FirstOrDefaultAsync(x => x.Id == Id);

            var elasticPhotos = await _photoService.GetAll();

            var ListOfPhotos = _mapper.Map<IEnumerable<PhotoDocument>>(elasticPhotos);

            var Photos = from pa in result.PhotoAlbums
                         join el in ListOfPhotos on pa.PhotoId equals el.Id
                         select el;

            IEnumerable<PhotoDocumentDTO> photoDocumentDTOs = _mapper.Map<PhotoDocumentDTO[]>(Photos);
            foreach (PhotoDocumentDTO photoDocumentDTO in photoDocumentDTOs)
            {
                photoDocumentDTO.Reactions =
                    _mapper.Map<LikeDTO[]>(
                    Context.Likes
                    .Where(l => l.PhotoId == photoDocumentDTO.Id)
                    .ToArray());

                foreach (LikeDTO like in photoDocumentDTO.Reactions)
                {
                    if (like.Photo != null)
                    {
                        like.Photo.Likes = null;
                    }
                }
            }

            var album = new ReturnAlbumDTO()
            {
                Id = result.Id,
                Title = result.Title,
                User = _mapper.Map<UserDTO>(result.User)
            };
            if (result.Photo != null)
            {
                album.Photo = _mapper.Map<PhotoDocumentDTO>(ListOfPhotos.FirstOrDefault(x => x.Id == result.Photo.Id));
                album.PhotoAlbums = photoDocumentDTOs;
            }
            
            return album;
        }

        private void UnbindEntitiesFromAlbum(Album album)
        {
            UnbindPhotosFromAlbum(album);
            UnbindVideosFromAlbum(album);
            UnbindSharedFromAlbum(album);
        }

        private void UnbindPhotosFromAlbum(Album album)
        {
            var photoAlbumsFromDeletingAlbum =
                Context.PhotoAlbums.Where(photo => EF.Property<int>(photo, "AlbumId") == album.Id);
            foreach (var photoAlbum in photoAlbumsFromDeletingAlbum)
            {
                album.PhotoAlbums.Remove(photoAlbum);
            }
        }
        
        private void UnbindVideosFromAlbum(Album album)
        {
            var videoAlbumsFromDeletingAlbum =
                Context.VideoAlbums.Where(video => EF.Property<int>(video, "AlbumId") == album.Id);
            foreach (var videoAlbum in videoAlbumsFromDeletingAlbum)
            {
                album.VideoAlbums.Remove(videoAlbum);
            }
        }
        
        private void UnbindSharedFromAlbum(Album album)
        {
            var sharedAlbumsFromDeletingAlbum =
                Context.SharedAlbums.Where(user => EF.Property<int>(user, "AlbumId") == album.Id);
            foreach (var sharedAlbum in sharedAlbumsFromDeletingAlbum)
            {
                album.SharedAlbums.Remove(sharedAlbum);
            }
        }
        
        public async Task<int> RemovePhotosFromAlbum(int albumId, int[] photos)
        {
            foreach(var p in photos)
            {
                var photoAlbum = await Context.PhotoAlbums.FirstOrDefaultAsync(pa => pa.AlbumId == albumId && pa.PhotoId == p);
                Context.PhotoAlbums.Remove(photoAlbum);
            }
            return await Context.SaveChangesAsync();
        }

        public async Task<int> UpdateAlbumTitle(UpdateAlbumDTO album)
        {
            var alb = await Context.Albums.FirstOrDefaultAsync(a => a.Id == album.Id);
            if(album != null)
            {
                alb.Title = album.Title;
                return await Context.SaveChangesAsync();
            }
            return -1;
        }
    }
}
