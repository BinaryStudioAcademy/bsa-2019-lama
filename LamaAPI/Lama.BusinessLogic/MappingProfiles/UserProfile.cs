using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using AutoMapper;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO;
using Newtonsoft.Json;

namespace Lama.BusinessLogic.MappingProfiles
{
    class UserProfile : Profile
    {
        private HttpClient client = new HttpClient();
        public UserProfile()
        {
            CreateMap<User, UserDTO>()
               .ForMember(
                dest => dest.Avatar,
                opt => opt.MapFrom(src => GetPhoto(src.Photo.Id))
                );
        }

        public PhotoDocument GetPhoto(int id)
        {
            string str = $"http://localhost:51439/api/photos/";
            return JsonConvert.DeserializeObject<PhotoDocument>(client.GetAsync($"{str}{id}").Result.Content.ReadAsStringAsync().Result);
        }
    }
}
