using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Lama.BusinessLogic.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.BlobModels;
using Lama.Domain.DTO;

namespace Lama.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _service;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _service = favoriteService;
        }

        [HttpGet]
        [Route("photos/{userId}")]
        public async Task<IEnumerable<PhotoDocument>> GetFavoritesPhotos(int userId)
        {
            return await _service.GetFavoritesPhotos(userId);
        }

        [HttpGet]
        [Route("ids/{userId}")]
        public async Task<IEnumerable<int>> GetFavoritesIds(int userId)
        {
            return await _service.GetFavoritesIds(userId);
        }

        [HttpDelete]
        public async Task<int> CreateFavorite(int userId)
        {
            return await _service.DeleteFavorite(userId);
        }

        [HttpDelete]
        public async Task<int> DeleteFavorite(int userId)
        {
            return await _service.DeleteFavorite(userId);
        }
        
        
    }
}