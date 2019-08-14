using AutoMapper;

using Lama.Domain.DbModels;
using Lama.Domain.DTO.User;
using Lama.Domain.DTO.Photo;

namespace Lama.Domain.MappingProfiles
{
    public class UserProfile: Profile
    {
        public UserProfile()
        {
            CreateMap<UserDTO, User>().ReverseMap();
            CreateMap<CreatePhotoDTO, Photo>().ReverseMap();
            CreateMap<User, GetUserDTO>();
        }
    }
}
