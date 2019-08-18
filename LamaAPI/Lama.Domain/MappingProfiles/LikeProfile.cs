using AutoMapper;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;
using Lama.Domain.DTO.Reaction;

namespace Lama.Domain.MappingProfiles
{
    public class LikeProfile: Profile
    {
        public LikeProfile()
        {
            CreateMap<LikeDTO, Like>().ReverseMap();
        }
    }
}