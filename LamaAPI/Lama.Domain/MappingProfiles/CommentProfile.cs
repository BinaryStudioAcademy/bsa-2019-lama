using AutoMapper;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;

namespace Lama.Domain.MappingProfiles
{
    public class CommentProfile: Profile
    {
        public CommentProfile()
        {
            CreateMap<CommentDTO, Comment>().ReverseMap();
        }
    }
}