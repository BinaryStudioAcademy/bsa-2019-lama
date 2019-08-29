using AutoMapper;
using Lama.Domain.DTO.Photo;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;

namespace Lama.Domain.MappingProfiles
{
    public class ImageTagProfile: Profile
    {
        public ImageTagProfile()
        {
            CreateMap<ImageTag, ImageTagDTO>().ReverseMap();
        }
    }
}