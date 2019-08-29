using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;

namespace Photo.Domain.DataTransferObjects
{
    public class ImageTagDTO
    {
        public string Name { get; set; }
        public double Confidence { get; set; }
        public string Hint { get; set; }
    }
}