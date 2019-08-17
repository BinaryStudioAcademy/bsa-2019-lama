using AutoMapper;
using Lama.Domain.BlobModels;
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
            CreateMap<PhotoDocument, PhotoAlbumDetails>()
                .ForMember(x=>x.ImageUrl,opt=>opt.MapFrom(x=>x.Blob64Id));
        }
    }
}

