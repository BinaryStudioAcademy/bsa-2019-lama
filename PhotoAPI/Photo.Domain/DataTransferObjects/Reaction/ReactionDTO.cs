using System;
using System.Collections.Generic;
using System.Text;

namespace Photo.Domain.DataTransferObjects.Reaction
{
    public class ReactionDTO
    {
        public string UserId { set; get; }
        public bool Reaction { set; get; }
    }
}
