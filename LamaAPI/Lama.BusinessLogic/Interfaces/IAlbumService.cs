using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Lama.Domain.DTO.Album;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IAlbumService : IBaseService<Album>
    {
        Task<int> CreateAlbumWithExistPhotos(AlbumWithExistPhotosDTO album);
        Task<int> CreateAlbumWithNewPhotos(NewAlbumDTO albumDto);
        Task UpdateAlbum(UpdateAlbumDTO albumDto);
        Task<List<ReturnAlbumDTO>> FindAll(int UserId);
        Task<ReturnAlbumDTO> FindAlbum(int Id);
        Task<List<Byte[]>> GetPhotos(PhotoDocument[] photoDocuments);
        Task<int> RemoveAlbum(int id);
        Task<int> RemoveAlbumCover(int id);
        Task<int?> UpdateCover(UpdateAlbumDTO album);
        Task<List<AlbumPhotoDetails>> GetAlbumPhotoDetails(int id);
    }
}
