using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.Photo
{
    public class NewPhoto
    {
        public string ImageUrl { get; set; }
        public string Description { get; set; }
        public string FileName { get; set; }
        public string Coordinates { set; get; }
        public string Location { get; set; }
        public string ShortLocation { set; get; }
    }
}
