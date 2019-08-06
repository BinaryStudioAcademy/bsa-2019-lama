using Newtonsoft.Json;

namespace Lama.Domain.DbModels
{
    public partial class PhotoState
    {
        public int RotateDegree { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public int PhotoId { get; set; }

        [JsonIgnore]
        public Photo Photo { get; set; }
    }
}
