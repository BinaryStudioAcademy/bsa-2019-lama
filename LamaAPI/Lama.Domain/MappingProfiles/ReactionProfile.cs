﻿using AutoMapper;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Reaction;
using System;
using System.Collections.Generic;
using System.Text;

namespace Lama.Domain.MappingProfiles
{
    public class ReactionProfile : Profile
    {
        public ReactionProfile()
        {
            CreateMap<Like, LikeDTO>()
                .ForMember(x => x.UserId, opt => opt.MapFrom(x => x.UserId));
        }
    }
}