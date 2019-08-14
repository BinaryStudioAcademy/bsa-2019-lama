using AutoMapper;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;

namespace Lama.Domain.MappingProfiles
{
    public class FavoriteProfile: Profile
    {
        public FavoriteProfile()
        {
            CreateMap<FavoriteDTO, Favorite>().ReverseMap();
        }
    }
}