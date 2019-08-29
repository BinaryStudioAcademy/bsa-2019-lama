using System.Collections.Generic;
using AutoMapper;
using Lama.Domain.BlobModels;
using Lama.Domain.DTO.Photo;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;
using Newtonsoft.Json;

namespace Lama.Domain.MappingProfiles
{
    public class PhotoDocumentProfile: Profile
    {
        public PhotoDocumentProfile()
        {
            CreateMap<PhotoDocument, PhotoDocumentDTO>().ForMember(photoDoc => photoDoc.Tags,
                dto => dto.MapFrom(data => JsonConvert.DeserializeObject<IEnumerable<ImageTag>>(data.Tags))).ReverseMap();
            CreateMap<UpdatedPhotoResultDTO, PhotoDocumentDTO>().ReverseMap();
            CreateMap<UploadPhotoResultDTO, PhotoDocumentDTO>().ReverseMap();
        }
    }
}