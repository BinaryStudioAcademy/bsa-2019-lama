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
        }
    }
}