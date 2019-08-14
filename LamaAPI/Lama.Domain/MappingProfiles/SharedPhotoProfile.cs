using AutoMapper;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;

namespace Lama.Domain.MappingProfiles
{
    public class SharedPhotoProfile: Profile
    {
        public SharedPhotoProfile()
        {
            CreateMap<SharedPhotoDTO, SharedPhoto>().ReverseMap();
        }
    }
}