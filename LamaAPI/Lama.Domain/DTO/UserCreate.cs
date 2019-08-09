using Lama.Domain.BlobModels;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO
{
    public class UserCreate
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public PhotoReceived Avatar { get; set; }
    }
}
