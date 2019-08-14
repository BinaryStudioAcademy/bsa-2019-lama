using AutoMapper;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;

namespace Lama.Domain.MappingProfiles
{
    public class PhotoAlbumProfile: Profile
    {
        public PhotoAlbumProfile()
        {
            CreateMap<PhotoAlbumDTO, PhotoAlbum>().ReverseMap();
        }
        
    }
}