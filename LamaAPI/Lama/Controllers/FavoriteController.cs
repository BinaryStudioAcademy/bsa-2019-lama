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
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Photo;
using Microsoft.AspNetCore.Authorization;

namespace Lama.Controllers
{
    [Authorize]
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
        public Task<IEnumerable<PhotoDocumentDTO>> GetFavoritesPhotos(int userId)
        {
            return _service.GetFavoritesPhotos(userId);
        }

        [HttpGet]
        [Route("ids/{userId}")]
        public async Task<IEnumerable<int>> GetFavoritesIds(int userId)
        {
            return await _service.GetFavoritesPhotosId(userId);
        }

        [HttpPost]
        public async Task<int> CreateFavorite([FromBody]Favorite favorite )
        {
            return await _service.CreateFavorite(favorite);
        }

        [HttpDelete("{userId}/{photoId}")]
        public async Task<int> DeleteFavorite(int userId, int photoId)
        {
            return await _service.DeleteFavorite(userId, photoId);
        }

        [HttpDelete("{userId}")]
        public async Task<int> DeleteFavorites(int userId)
        {
            return await _service.DeleteFavoritesForUser(userId);
        }
    }
}