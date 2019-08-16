using AutoMapper;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Album;

namespace Lama.Domain.MappingProfiles
{
    public class AlbumProfile: Profile
    {
        public AlbumProfile()
        {
            CreateMap<AlbumWithExistPhotosDTO, Album>().ReverseMap();
            CreateMap<NewAlbumDTO, Album>().ReverseMap();
            CreateMap<ReturnAlbumDTO, Album>().ReverseMap();
            CreateMap<Album, AlbumPhotoDetails>()
                .ForMember(x => x.Title, opt => opt.MapFrom(x => x.Title))
                .ForMember(x => x.Photo, opt => opt.Ignore());
        }
    }
}