using AutoMapper;
using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess;
using Lama.Domain.BlobModels;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Album;
using Lama.Domain.DTO.Photo;
using Lama.Domain.DTO.Reaction;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Services
{
    public class LocationService : ILocationService
    {
        private readonly HttpClient httpClient;
        readonly ApplicationDbContext Context;
        readonly IConfiguration configuration;
        private readonly IMapper _mapper;
        public LocationService(ApplicationDbContext Context, IConfiguration configuration, IMapper _mapper)
        {
            httpClient = new HttpClient();
            this.Context = Context;
            this.configuration = configuration;
            this._mapper = _mapper;
        }
        public async Task<int> CheckAdrress(string shortLocation)
        {
            var loca = await Context.Locations.FirstOrDefaultAsync(x => x.Name == shortLocation);
            if(loca == null)
            {
                var newLocation = new Location() { Name = shortLocation };
                loca = (await Context.Locations.AddAsync(newLocation)).Entity;
                await Context.SaveChangesAsync();
            }
            return loca.Id;
        }
        public async Task<List<ReturnAlbumDTO>> GetUserAlbumsByCountry(int id)
        {
            List<ReturnAlbumDTO> returnList = new List<ReturnAlbumDTO>();

            var photosElastic = await GetUserPhotos(id);
            var photosBd = Context.Photos.Include(x=>x.Location).Where(x => x.UserId == id && x.Location != null);

            foreach(var item in photosBd)
            {
                item.Location.Name = item.Location.Name.Split(new char[] { ',' })[0];
            }
            var Cities = photosBd.GroupBy(x => x.Location.Name).Select(g => new {
                Name = g.Key,
                Photos = g.Select(q => q)
            });
            foreach (var city in Cities)
            {
                if (city.Name == null)
                {
                    continue;
                }
                var Name = city.Name;

                var photos = from pl in photosElastic
                             join t in city.Photos on pl.Id equals t.Id
                             select pl;

                var album = new ReturnAlbumDTO()
                {
                    Title = Name
                };
                if (photos != null && photos.Count() != 0)
                {

                    foreach (var item in photos)
                    {
                        item.Reactions = _mapper.Map<LikeDTO[]>(Context.Likes
                            .Where(l => l.PhotoId == item.Id)
                            .ToArray());

                        foreach (LikeDTO like in item.Reactions)
                        {
                            if (like.Photo != null)
                            {
                                like.Photo.Likes = null;
                            }
                        }
                    }

                    album.Photo = photos.First();
                    album.PhotoAlbums = photos;
                    returnList.Add(album);
                }
            }
            return returnList;
        }
        public async Task<List<ReturnAlbumDTO>> GetUserAlbumsByCity(int id)
        {
            List<ReturnAlbumDTO> returnList = new List<ReturnAlbumDTO>();

            var photosElastic = await GetUserPhotos(id);
            var photosBd = Context.Photos.Where(x => x.UserId == id);

            var Cities = photosBd.GroupBy(x => x.LocationId).Select(g => new {
                Context.Locations.FirstOrDefault(h => h.Id == g.Key).Name,
                Photos = g.Select(q => q)
            });

            foreach(var city in Cities)
            {
                if(city.Name == null)
                {
                    continue;
                }
                var Name = city.Name;

                var photos = from pl in photosElastic
                             join t in city.Photos on pl.Id equals t.Id
                             select pl;          
                
                var album = new ReturnAlbumDTO()
                {
                    Title = Name
                };
                if(photos != null && photos.Count() != 0)
                {

                    foreach(var item in photos)
                    {
                        item.Reactions = _mapper.Map<LikeDTO[]>(Context.Likes
                            .Where(l => l.PhotoId == item.Id)
                            .ToArray());

                        foreach (LikeDTO like in item.Reactions)
                        {
                            if (like.Photo != null)
                            {
                                like.Photo.Likes = null;
                            }
                        }
                    }

                    album.Photo = photos.First();
                    album.PhotoAlbums = photos;
                    returnList.Add(album);
                }
            }

            return returnList;
        }
        public async Task<IEnumerable<PhotoDocumentDTO>> GetUserPhotos(int id)
        {
            var url = configuration["PhotoApiUrl"];

            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var response = await httpClient.GetAsync($"{url}api/photos");

            var responseContent = await response.Content.ReadAsStringAsync();

            var PhotoDocuments = JsonConvert.DeserializeObject<IEnumerable<PhotoDocument>>(responseContent);
            //

            var photos = _mapper.Map<List<PhotoDocumentDTO>>(PhotoDocuments);

            return photos;
        }
        public async Task DeleteLocation(int id)
        {
            var loca = await Context.Locations.FirstOrDefaultAsync(x=>x.Id == id);
            if(loca != null)
            {
                Context.Locations.Remove(loca);
                await Context.SaveChangesAsync();
            }
        }

    }
}
