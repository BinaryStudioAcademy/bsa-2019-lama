﻿using Microsoft.Azure.CognitiveServices.Vision.ComputerVision.Models;
using System.Collections.Generic;

namespace Photo.Domain.DataTransferObjects
{
    public class TextOnPhotoDTO
    {
        public string Language { get; set; }
        public double TextAngle { get; set; }
        public string Orientation { get; set; }
        public List<OcrRegion> Regions { get; set; }
    }
}
