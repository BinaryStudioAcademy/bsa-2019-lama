using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Album;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Lama.BusinessLogic.Exceptions;

namespace Lama.BusinessLogic.Services
{
    public class AlbumService : BaseService<Album>, IAlbumService
    {
        private readonly IPhotoService _photoService;
        IConfiguration configuration;
        public AlbumService(ApplicationDbContext Context, IConfiguration configuration, IPhotoService _photoService)
            : base(Context)
        {
            this._photoService = _photoService;
            this.configuration = configuration;
        }

        public async Task CreateAlbumWithNewPhotos(NewAlbum album)
        {
            string url = configuration["PhotoApiUrl"];

            using (HttpClient httpClient = new HttpClient())
            {
                var elasticIds = (JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(
                    await
                    (await httpClient.PostAsJsonAsync($"{url}api/photos", album.Photos)).Content.ReadAsStringAsync()))
                    .Select(x => x.Id);



                var user = await Context.Users.FirstOrDefaultAsync(x => x.Id == album.AuthorId);
                Album TempAlbum = new Album()
                {
                    Title = album.Title,
                    User = user
                };


                List<PhotoAlbum> photoAlbums = new List<PhotoAlbum>();
                List<Photo> photos = new List<Photo>();

                for (int i = 0; i < album.Photos.Length; i++)
                {
                    var TempPhoto = new Photo();
                    photos.Add(TempPhoto);
                    photoAlbums.Add(new PhotoAlbum() { Photo = TempPhoto, Album = TempAlbum });
                }

                if (photos.Count != 0)
                {
                    TempAlbum.Photo = photos[0];
                    TempAlbum.PhotoAlbums = photoAlbums;
                }

                await Context.Albums.AddAsync(TempAlbum);
                await Context.Photos.AddRangeAsync(photos);
                await Context.SaveChangesAsync();
            }
        }
        public async Task CreateAlbumWithExistPhotos(AlbumWithExistPhotos album)
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

        }
        public async Task<List<ReturnAlbum>> FindAll(int UserId)
        {
            var result = await Context.Albums
                .Include(t => t.PhotoAlbums)
                 .ThenInclude(x => x.Photo)
                .Include(x => x.Photo)
                .Where(x => x.UserId == UserId).ToListAsync();

            var ListOfPhotos = await _photoService.GetAll();

            List<ReturnAlbum> albums = new List<ReturnAlbum>();
            foreach (var item in result)
            {

                var Photos = from pa in item.PhotoAlbums
                             join el in ListOfPhotos on pa.Photo.Id equals el.Id
                             select el;

                var album = new ReturnAlbum()
                {
                    Id = item.Id,
                    Title = item.Title
                };
                if(item.Photo != null)
                {
                    album.Photo = ListOfPhotos.FirstOrDefault(x => x.Id == item.Photo.Id);
                    album.PhotoAlbums = Photos.ToList();
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

        public async Task<int> RemoveAlbum(int id)
        {
            var albumToDelete = await Context.Albums.FindAsync(id);
            if (albumToDelete == null)
            {
                throw new NotFoundException(nameof(Album), id);
            }

            //TODO: Add video and shared albums deletion when they will be implemented
            UnbindEntitiesFromAlbum(albumToDelete);
            Context.Albums.Remove(albumToDelete);
            await Context.SaveChangesAsync();
            return id;
        }

        
        public async Task<ReturnAlbum> FindAlbum(int Id)
        {
            var result = await Context.Albums
                .Include(t => t.PhotoAlbums)
                 .ThenInclude(x => x.Photo)
                .Include(x => x.Photo)
                .FirstOrDefaultAsync(x => x.Id == Id);

            var ListOfPhotos = await _photoService.GetAll();

                var Photos = from pa in result.PhotoAlbums
                             join el in ListOfPhotos on pa.Photo.Id equals el.Id
                             select el;


            var album = new ReturnAlbum()
            {
                Id = result.Id,
                Title = result.Title,
            };
            if(result.Photo != null)
            {
                album.Photo = ListOfPhotos.FirstOrDefault(x => x.Id == result.Photo.Id);
                album.PhotoAlbums = Photos.ToList();
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
