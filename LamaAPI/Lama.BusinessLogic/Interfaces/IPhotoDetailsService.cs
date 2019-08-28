using Lama.Domain.DTO.PhotoDetails;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface IPhotoDetailsService
    {
        Task<string> UpdateDescription(NewDescription newDescription);
        Task<string> UpdateLocation(NewLocation newLocation);
        Task DeleteLocation(int id);
    }
}
