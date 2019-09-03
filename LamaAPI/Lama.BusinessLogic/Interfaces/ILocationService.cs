using Lama.Domain.DTO.Album;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface ILocationService
    {
        Task<int> CheckAdrress(string shortLocation);
        Task<List<ReturnAlbumDTO>> GetUserAlbumsByCity(int id);
        Task<List<ReturnAlbumDTO>> GetUserAlbumsByCountry(int id);
    }
}
