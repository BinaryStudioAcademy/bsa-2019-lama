using Lama.BusinessLogic.Exceptions;
using Lama.DataAccess;
using Lama.Domain.DbModels;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.BlobModels;
using Lama.Domain.DTO.Photo;
using Lama.Domain.DTO.Album;
using Lama.Domain.DTO.Reaction;
using Remotion.Linq.Utilities;

namespace Lama.BusinessLogic.Services
{
    public class SharingAlbumService : BaseService<Album>
    {
        private IPhotoService _photoService;
        private IMapper _mapper;
        public SharingAlbumService(ApplicationDbContext context, IPhotoService photoService, IMapper mapper)
            : base(context)
        {
            this._photoService = photoService;
            this._mapper = mapper;
        }

        public async Task<Album> Get(int id)
        {
            throw new System.NotImplementedException();
        }

        public async Task<IEnumerable<ReturnAlbumDTO>> GetSharedAlbums(int userId)
        {
            var results = await Context.SharedAlbums.Where(item => item.UserId == userId || item.Album.UserId == userId).Select(item => item.Album)
                .Include(t => t.PhotoAlbums)
                .Include(x => x.Photo).GroupBy(x => x.Id, (x, y) => new Album()
                {
                     Id = y.FirstOrDefault().Id,
                     UserId = y.FirstOrDefault().UserId,
                     SharedAlbums = y.FirstOrDefault().SharedAlbums,
                     Photo = y.FirstOrDefault().Photo,
                     PhotoAlbums = y.FirstOrDefault().PhotoAlbums,
                     Title = y.FirstOrDefault().Title,
                     User = y.FirstOrDefault().User,
                     CoverId = y.FirstOrDefault().CoverId,
                     SharedLink = y.FirstOrDefault().SharedLink
                })
                .ToListAsync();

            var photoIds = await Context.SharedPhotos.Where(item => item.UserId == userId).Select(item => item.Photo.Id).ToListAsync();
            List<PhotoDocument> photosList = new List<PhotoDocument>();
            foreach (var id in photoIds)
            {
                var item = await _photoService.Get(id);
                photosList.Add(item);
            }

            IEnumerable<PhotoDocumentDTO> photosDto = _mapper.Map<PhotoDocumentDTO[]>(photosList);

            var elasticPhotos = await _photoService.GetAll();

            List<ReturnAlbumDTO> albums = new List<ReturnAlbumDTO>();
            foreach (PhotoDocumentDTO photoDto in photosDto)
            {
                photoDto.Reactions =
                    _mapper.Map<LikeDTO[]>(
                        Context.Likes
                            .Where(l => l.PhotoId == photoDto.Id)
                            .ToArray());

                foreach (LikeDTO like in photoDto.Reactions)
                {
                    if (like.Photo != null)
                    {
                        like.Photo.Likes = null;
                    }
                }
                var fakeAlbum = new ReturnAlbumDTO
                {
                    Id = -1,
                    Title = photoDto.UploadDate.ToShortDateString(),
                    Photo = photoDto,
                    PhotoAlbums = new List<PhotoDocumentDTO>() { photoDto}
                };
                albums.Add(fakeAlbum);
            }
            foreach (var result in results)
            {
                IEnumerable<PhotoDocument> ListOfPhotos;
                try
                {
                    ListOfPhotos = _mapper.Map<IEnumerable<PhotoDocument>>(elasticPhotos);
                }
                catch (Exception e)
                {
                    ListOfPhotos = null;
                }
                

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
                };
                if (result.Photo != null)
                {
                    album.Photo = _mapper.Map<PhotoDocumentDTO>(ListOfPhotos.FirstOrDefault(x => x.Id == result.Photo.Id));
                    album.PhotoAlbums = photoDocumentDTOs;
                }

                albums.Add(album);
            }

            return albums;
            
        }

        public async Task Delete(int albumId)
        {
            var entites = Context.SharedAlbums.Where(a => a.AlbumId == albumId);
            Context.SharedAlbums.RemoveRange(entites);
            await Context.SaveChangesAsync();
        }

        public async Task DeleteForUser(int albumId, int userId)
        {
            var entity = Context.SharedAlbums.Where(a => a.AlbumId == albumId).FirstOrDefault(i => i.UserId == userId);
            Context.SharedAlbums.Remove(entity);
            await Context.SaveChangesAsync();
        }

        public async Task SharingAlbum(SharedAlbum sharedAlbum)
        {
			var album = (await Context.SharedAlbums.FirstOrDefaultAsync(a => a.AlbumId == sharedAlbum.AlbumId && a.UserId == sharedAlbum.UserId));
			
			if(album == null)
			{
				await Context.SharedAlbums.AddAsync(sharedAlbum);
				await Context.SaveChangesAsync();
			}
        }
    }
}
