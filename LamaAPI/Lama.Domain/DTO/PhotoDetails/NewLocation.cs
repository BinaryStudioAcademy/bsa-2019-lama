using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.PhotoDetails
{
    public class NewLocation
    {
        public int Id { set; get; }
        public string Location { set; get; }
        public string Coordinates { set; get; }
        public string ShortLocation { set; get; }
    }
}
