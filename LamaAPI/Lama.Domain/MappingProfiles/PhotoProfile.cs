using AutoMapper;
using Lama.Domain.BlobModels;
using Lama.Domain.DTO.Photo;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.MappingProfiles
{
    public class PhotoProfile : Profile
    {
        public PhotoProfile()
        {
            CreateMap<PhotoDocument, PhotoDocumentDTO>().ReverseMap();
        }
    }
}
