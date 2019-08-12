using AutoMapper;

using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;

namespace Photo.BusinessLogic.MappingProfiles
{
    public class PhotoProfile : Profile
    {
        public PhotoProfile()
        {
            CreateMap<PhotoDocument, DeletedPhotoDTO>();
        }
    }
}
