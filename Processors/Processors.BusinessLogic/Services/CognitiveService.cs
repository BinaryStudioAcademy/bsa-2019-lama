using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision;
using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;
using Processors.BusinessLogic.Interfaces;

namespace Processors.BusinessLogic.Services
{
    public class CognitiveService: ICognitiveService
    {
        
        private readonly string _endpoint;
        private readonly string _endpointKey;

        public CognitiveService( string url, string endpointKey)
        {
            _endpoint = url;
            _endpointKey = endpointKey;
        }
        
        public async Task<IEnumerable<ImageTag>> ProcessImageTags(byte[] imageAsByteArray)
        {
            using (var client = new ComputerVisionClient(new ApiKeyServiceClientCredentials(_endpointKey)))
            {
                client.Endpoint = _endpoint;
                using (Stream stream = new MemoryStream(imageAsByteArray))
                {
                    try
                    {
                        var response = await client.TagImageInStreamAsync(stream, "en");
                        
                        return response.Tags;

                    }
                    catch (Exception)
                    {
                        return null;
                    }
                }
            }
        }

        public async Task<string> ProcessImageDescription(byte[] imageAsByteArray)
        {
            using (var client = new ComputerVisionClient(new ApiKeyServiceClientCredentials(_endpointKey)))
            {
                client.Endpoint = _endpoint;
                using (Stream stream = new MemoryStream(imageAsByteArray))
                {
                    try
                    {
                        var response = await client.DescribeImageInStreamAsync(stream,1,"en");
                        
                        return response.Tags.First();
                    }
                    catch (Exception)
                    {
                        return null;
                    }
                }
            }
        }
    }
}