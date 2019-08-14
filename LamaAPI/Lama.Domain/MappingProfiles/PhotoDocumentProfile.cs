using AutoMapper;
using Lama.Domain.BlobModels;
using Lama.Domain.DTO.Photo;

namespace Lama.Domain.MappingProfiles
{
    public class PhotoDocumentProfile: Profile
    {
        public PhotoDocumentProfile()
        {
            CreateMap<PhotoDocument, PhotoDocumentDTO>().ReverseMap();

        }
    }
}