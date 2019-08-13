using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO.Reaction
{
    public class NewReactionDTO
    {
        public int PhotoId { set; get; }
        public int UserId { set; get; }
        public bool Reaction { set; get; }
    }
}
