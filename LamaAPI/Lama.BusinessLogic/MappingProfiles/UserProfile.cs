using System;
using System.Collections.Generic;
using System.Text;
using AutoMapper;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.User;
using Lama.BusinessLogic;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using System.Linq;
using Lama.Domain.BlobModels;

namespace Lama.BusinessLogic.MappingProfiles
{
    public class UserProfile: Profile
    {
        public UserProfile()
        {
            CreateMap<UserDTO, User>().ReverseMap();
            CreateMap<PhotoReceived, Photo>().ReverseMap();
        }
    }
}
