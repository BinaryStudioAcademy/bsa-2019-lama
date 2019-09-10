using AutoMapper;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;
using Photo.Domain.DataTransferObjects;

namespace Photo.Domain.MappingProfiles
{
    public class ImageTextProfile : Profile
    {
        public ImageTextProfile()
        {
            CreateMap<OcrResult, TextOnPhotoDTO>().ReverseMap();
        }
    }
}