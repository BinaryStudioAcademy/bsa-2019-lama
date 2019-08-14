using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Album;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IAlbumService : IBaseService<Album>
    {
        Task CreateAlbumWithExistPhotos(AlbumWithExistPhotos album);
        Task CreateAlbumWithNewPhotos(NewAlbum album);
        Task<List<ReturnAlbum>> FindAll(int UserId);
        Task<ReturnAlbum> FindAlbum(int Id);
        Task<List<Byte[]>> GetPhotos(PhotoDocument[] photoDocuments);
    }
}
