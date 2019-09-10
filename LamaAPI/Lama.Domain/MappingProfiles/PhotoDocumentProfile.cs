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
            CreateMap<PhotoDocument, PhotoDocumentDTO>()
                .ForMember(dto => dto.Tags, photoDoc => photoDoc.MapFrom(data => JsonConvert.DeserializeObject<IEnumerable<ImageTag>>(data.Tags)))
                .ForMember(dto => dto.Text, photoDoc => photoDoc.MapFrom(data => JsonConvert.DeserializeObject<OcrResult>(data.Text)));
            CreateMap<PhotoDocumentDTO, PhotoDocument>()
                .ForMember(photoDoc => photoDoc.Tags, dto => dto.MapFrom(data => JsonConvert.SerializeObject(data.Tags)))
                .ForMember(photoDoc => photoDoc.Text, dto => dto.MapFrom(data => JsonConvert.SerializeObject(data.Text)));
            CreateMap<UpdatedPhotoResultDTO, PhotoDocumentDTO>().ReverseMap();
            CreateMap<UploadPhotoResultDTO, PhotoDocumentDTO>().ReverseMap();
        }
    }
}