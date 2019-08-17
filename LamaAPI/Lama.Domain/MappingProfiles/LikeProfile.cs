using AutoMapper;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;

namespace Lama.Domain.MappingProfiles
{
    public class LikeProfile: Profile
    {
        public LikeProfile()
        {
            CreateMap<LikeDTO, Like>().ReverseMap();
            CreateMap<Lama.Domain.DTO.Reaction.LikeDTO, Like>().ReverseMap();
        }
    }
}