using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Lama.Domain.DTO.Album;
using Lama.Domain.DTO.Photo;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IAlbumService : IBaseService<Album>
    {
        Task<ReturnAlbumDTO> CreateAlbumWithExistPhotos(AlbumWithExistPhotosDTO album);
        Task<ReturnAlbumDTO> CreateAlbumWithNewPhotos(NewAlbumDTO albumDto);
        Task<int> CreateEmptyAlbum(NewAlbumDTO albumDto);
        Task UpdateAlbum(UpdateAlbumDTO albumDto);
        Task<List<ReturnAlbumDTO>> FindAll(int UserId);
        Task<ReturnAlbumDTO> FindAlbum(int Id);
        Task<List<byte[]>> GetPhotos(PhotoDocument[] photoDocuments);
        Task<int> RemoveAlbum(int id);
        Task<int> RemoveAlbumCover(int id);
        Task<int> RemovePhotosFromAlbum(int albumId, int[] photos);
        Task<int?> UpdateCover(UpdateAlbumDTO album);
        Task<List<AlbumPhotoDetails>> GetAlbumPhotoDetails(int id);
        Task<List<PhotoDocumentDTO>> AddNewPhotosToAlbum(NewPhotosAlbum newPhotosAlbum);
        Task<List<PhotoDocumentDTO>> AddExistPhotosToAlbum(ExistPhotosAlbum existPhotosAlbum);
    }
}
