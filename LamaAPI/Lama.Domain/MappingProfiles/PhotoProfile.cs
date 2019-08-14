using AutoMapper;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Photo;

namespace Lama.Domain.MappingProfiles
{
    public class PhotoProfile: Profile
    {
        public PhotoProfile()
        {
            CreateMap<CreatePhotoDTO, Photo>().ReverseMap();
            CreateMap<PhotoDTO, Photo>().ReverseMap();
        }
    }
}