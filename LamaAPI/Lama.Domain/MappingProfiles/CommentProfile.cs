using AutoMapper;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Comments;

namespace Lama.Domain.MappingProfiles
{
    public class CommentProfile : Profile
    {
        public CommentProfile()
        {
            CreateMap<Comment, CommentListDTO>()
                .ForMember(dest => dest.CommentId,          opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.AuthorId,           opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.AuthorFirstName,    opt => opt.MapFrom(src => src.User.FirstName))
                .ForMember(dest => dest.AuthorLastName,     opt => opt.MapFrom(src => src.User.LastName))
                .ForMember(dest => dest.CommentText,        opt => opt.MapFrom(src => src.Text));

            CreateMap<CreateCommentDTO, Comment>();
        }
    }
}
