using System.Collections.Generic;
using AutoMapper;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;
using Newtonsoft.Json;
using Photo.Domain.BlobModels;
using Photo.Domain.DataTransferObjects;

namespace Photo.Domain.MappingProfiles
{
    public class PhotoProfile : Profile
    {
        public PhotoProfile()
        {
            CreateMap<PhotoDocument, DeletedPhotoDTO>();
            CreateMap<PhotoDocument, CreatePhotoResultDTO>().ReverseMap();
            CreateMap<PhotoDocument, PhotoDocumentDTO>().ForMember(dto => dto.Tags,
                photoDoc => photoDoc.MapFrom(data => JsonConvert.DeserializeObject<IEnumerable<ImageTag>>(data.Tags)));
            CreateMap<PhotoDocumentDTO, PhotoDocument>().ForMember(photoDoc => photoDoc.Tags,
                dto => dto.MapFrom(data => JsonConvert.SerializeObject(data.Tags)));
        }
    }
}
