using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DTO.Album;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LocationController : ControllerBase
    {
        ILocationService locationService;
        public LocationController(ILocationService locationService)
        {
            this.locationService = locationService;
        }

        [HttpGet("city/{id}")]
        public async Task<List<ReturnAlbumDTO>> GetLocationAlbums(int id)
        {
            return await this.locationService.GetUserAlbumsByCity(id);
        }
        [HttpGet("country/{id}")]
        public async Task<List<ReturnAlbumDTO>> GetLocationAlbumsCountry(int id)
        {
            return await this.locationService.GetUserAlbumsByCountry(id);
        }
    }
}