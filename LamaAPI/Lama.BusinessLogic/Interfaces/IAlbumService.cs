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
        Task CreateAlbumWithExistPhotos(NewAlbum album);
        Task CreateAlbumWithNewPhotos(NewAlbum album);
    }
}
