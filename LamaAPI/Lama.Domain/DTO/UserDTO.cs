﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.DTO
{
    class UserDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarUrl { get; set; }
    }
}
