using AutoMapper;
using Lama.Domain.DTO.Photo;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;

namespace Lama.Domain.MappingProfiles
{
    public class ImageTextProfile : Profile
    {
        public ImageTextProfile()
        {
            CreateMap<OcrResult, TextOnPhotoDTO>().ReverseMap();
        }
    }
}