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
        Task CreateAlbumWithExistPhotos(AlbumWithExistPhotosDTO album);
        Task CreateAlbumWithNewPhotos(NewAlbumDTO albumDto);
        Task UpdateAlbum(UpdateAlbumDTO albumDto);
        Task<List<ReturnAlbumDTO>> FindAll(int UserId);
        Task<ReturnAlbumDTO> FindAlbum(int Id);
        Task<List<Byte[]>> GetPhotos(PhotoDocument[] photoDocuments);
        Task<int> RemoveAlbum(int id);
        Task<int?> UpdateCover(UpdateAlbumDTO album);
    }
}
