using AutoMapper;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;
using Photo.Domain.DataTransferObjects;

namespace Photo.Domain.MappingProfiles
{
    public class ImageTagProfile: Profile
    {
        public ImageTagProfile()
        {
            CreateMap<ImageTag, ImageTagDTO>().ReverseMap();
        }
    }
}