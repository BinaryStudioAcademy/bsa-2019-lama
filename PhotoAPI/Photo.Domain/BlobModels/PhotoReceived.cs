using System;
using System.Collections.Generic;
using System.Text;

namespace Photo.Domain.BlobModels
{
    public class PhotoReceived
    {
        public string ImageUrl { get; set; }
        public string Description { get; set; }
        public int AuthorId { get; set; }
    }
}
