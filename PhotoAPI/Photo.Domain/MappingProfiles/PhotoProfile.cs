using AutoMapper;

using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;

namespace Photo.Domain.MappingProfiles
{
    public class PhotoProfile : Profile
    {
        public PhotoProfile()
        {
            CreateMap<PhotoDocument, DeletedPhotoDTO>();
            CreateMap<PhotoDocument, CreatePhotoResultDTO>();
        }
    }
}
