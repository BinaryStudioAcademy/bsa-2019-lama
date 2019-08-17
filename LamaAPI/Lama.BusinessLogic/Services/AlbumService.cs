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

namespace Lama.BusinessLogic.Services
{
    public class AlbumService : BaseService<Album>, IAlbumService
    {
        private readonly IPhotoService _photoService;
        private IUnitOfWork _context;
        IConfiguration configuration;
        private readonly IMapper _mapper;
        public AlbumService(ApplicationDbContext Context, IConfiguration configuration, IPhotoService _photoService, IUnitOfWork context,IMapper _mapper)
            : base(Context)
        {
            this._photoService = _photoService;
            this._context = context;
            this.configuration = configuration;
            this._context = context;
            this._mapper = _mapper;
        }

        public async Task UpdateAlbum(UpdateAlbumDTO album)
        {
   
            var photoAlbums = Context.PhotoAlbums.Where(i => i.AlbumId == album.Id);
            List<int> ids = photoAlbums.Select(i => i.PhotoId).ToList();
            var removedIds = ids.Except(album.PhotoIds);
            List<PhotoAlbum> removedPhotoAlbums = new List<PhotoAlbum>();
            foreach (var item in removedIds)
            {
                var photoAlbum = photoAlbums.FirstOrDefault(i => i.PhotoId == item);
                removedPhotoAlbums.Add(photoAlbum);
            }
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
        
        public async Task<int> CreateAlbumWithNewPhotos(NewAlbumDTO albumDto)
        {
            string url = configuration["PhotoApiUrl"];
            var PhotosAlbum = albumDto.Photos;


            Photo[] savedPhotos = new Photo[PhotosAlbum.Length];

            var user = await Context.Users.FirstOrDefaultAsync(x => x.Id == albumDto.AuthorId);

            Album TempAlbum = new Album()
            {
                Title = albumDto.Title,
                User = user
            };

            for (int i = 0; i < PhotosAlbum.Length; ++i)
            {
                savedPhotos[i] = await _context.GetRepository<Photo>().InsertAsync(new Photo());
            }
            await _context.SaveAsync();


            CreatePhotoDTO[] PhotosToCreate = new CreatePhotoDTO[PhotosAlbum.Length];

            for (int i = 0; i < PhotosToCreate.Length; ++i)
            {
                PhotosToCreate[i] = new CreatePhotoDTO()
                {
                    Id = savedPhotos[i].Id,
                    AuthorId = user.Id,
                    ImageUrl = PhotosAlbum[i].ImageUrl,
                    Description = PhotosAlbum[i].Description,
                    FileName = PhotosAlbum[i].FileName
                    };
            }
            
            List<PhotoAlbum> photoAlbums = new List<PhotoAlbum>();


            for (int i = 0; i < savedPhotos.Length; i++)
            {
                photoAlbums.Add(new PhotoAlbum() { Photo = savedPhotos[i] , Album = TempAlbum });
            }

            if (savedPhotos.Length != 0)
            {
                TempAlbum.Photo = savedPhotos[0];
                TempAlbum.PhotoAlbums = photoAlbums;
            }

            using (HttpClient httpClient = new HttpClient())
            {
                var elasticIds = (JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(
                    await
                    (await httpClient.PostAsJsonAsync($"{url}api/photos", PhotosToCreate)).Content.ReadAsStringAsync()))
                    .Select(x => x.Id);

                await Context.Albums.AddAsync(TempAlbum);
                await Context.SaveChangesAsync();
            }

            return TempAlbum.Id;
        }
        public async Task<int> CreateAlbumWithExistPhotos(AlbumWithExistPhotosDTO album)
        {
            var user = await Context.Users.FirstOrDefaultAsync(x => x.Id == album.AuthorId);
            Album TempAlbum = new Album()
            {
                Title = album.Title,
                User = user
            };

            List<PhotoAlbum> photoAlbums = new List<PhotoAlbum>();
            List<Photo> photos = new List<Photo>();

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

            await Context.Albums.AddAsync(TempAlbum);
            await Context.SaveChangesAsync();

            return TempAlbum.Id;

        }
        public async Task<List<ReturnAlbumDTO>> FindAll(int UserId)
        {
            var result = await Context.Albums
                .Include(t => t.PhotoAlbums)
                 .ThenInclude(x => x.Photo)
                .Include(x => x.Photo)
                .Where(x => x.UserId == UserId).ToListAsync();

            var ListOfPhotos = _mapper.Map<IEnumerable<PhotoDocument>>(await _photoService.GetAll());


            List<ReturnAlbumDTO> albums = new List<ReturnAlbumDTO>();
            foreach (var item in result)
            {

                var Photos = from pa in item.PhotoAlbums
                             join el in ListOfPhotos on pa.Photo.Id equals el.Id
                             select el;

                var album = new ReturnAlbumDTO()
                {
                    Id = item.Id,
                    Title = item.Title
                };
                if(item.Photo != null)
                {
                    album.Photo = ListOfPhotos.FirstOrDefault(x => x.Id == item.Photo.Id);
                    album.PhotoAlbums = _mapper.Map<PhotoDocumentDTO[]>(Photos);
                }
                albums.Add(album);
            }
            return albums;
        }
        public async Task<List<Byte[]>> GetPhotos(PhotoDocument[] photoDocuments)
        {
            string url = configuration["PhotoApiUrl"];
            using (HttpClient httpClient = new HttpClient())
            {
                return JsonConvert.DeserializeObject<List<Byte[]>>(
                    await
                    (await httpClient.PostAsJsonAsync($"{url}api/photos/ArchivePhotos", photoDocuments)).Content.ReadAsStringAsync());
            }
        }

        public async Task<List<AlbumPhotoDetails>> GetAlbumPhotoDetails(int id)
        {

                List<AlbumPhotoDetails> list = new List<AlbumPhotoDetails>();
                var albums = await Context.PhotoAlbums.Include(x => x.Photo).Include(x=>x.Album).Where(x=>x.Photo.Id == id).Select(x=>x.Album).ToListAsync();
                foreach(var album in albums)
                {              
                    var Document = await _photoService.Get(album.CoverId.Value);
                    var photo = _mapper.Map<PhotoAlbumDetails>(Document);
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
        public async Task<ReturnAlbumDTO> FindAlbum(int Id)
        {
            var result = await Context.Albums
                .Include(t => t.PhotoAlbums)
                 .ThenInclude(x => x.Photo)
                .Include(x => x.Photo)
                .FirstOrDefaultAsync(x => x.Id == Id);

            var ListOfPhotos = _mapper.Map<IEnumerable<PhotoDocument>>(await _photoService.GetAll());

            var Photos = from pa in result.PhotoAlbums
                             join el in ListOfPhotos on pa.Photo.Id equals el.Id
                             select el;

            IEnumerable<PhotoDocumentDTO> photoDocumentDTOs = _mapper.Map<PhotoDocumentDTO[]>(Photos);
            foreach(PhotoDocumentDTO photoDocumentDTO in photoDocumentDTOs)
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
            };
            if(result.Photo != null)
            {
                album.Photo = ListOfPhotos.FirstOrDefault(x => x.Id == result.Photo.Id);
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
    }
}
