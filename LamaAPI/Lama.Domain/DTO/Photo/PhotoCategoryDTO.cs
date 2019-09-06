using System.Collections.Generic;

namespace Lama.Domain.DTO.Photo
{
    public class PhotoCategoryDTO
    {
        public string Category { get; set; }
        public IEnumerable<PhotoDocumentDTO> Photos { get; set; }
    }
}