using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;

namespace Processors.BusinessLogic.Interfaces
{
    public interface ICognitiveService
    {
        Task<IEnumerable<ImageTag>> ProcessImageTags(byte[] imageAsByteArray);
    }
}