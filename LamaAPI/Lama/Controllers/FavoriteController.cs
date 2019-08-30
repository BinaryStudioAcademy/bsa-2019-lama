using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Photo;
using Lama.Infrastructure;
using Microsoft.AspNetCore.Authorization;

namespace Lama.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class FavoriteController : ControllerBase
    {
        private readonly IFavoriteService _service;
        private readonly IUserProtectionService _userProtectionService;

        public FavoriteController(IFavoriteService favoriteService, IUserProtectionService userProtectionService)
        {
            _service = favoriteService;
            _userProtectionService = userProtectionService;
        }

        [HttpGet]
        [Route("photos/{userId}")]
        public Task<IEnumerable<PhotoDocumentDTO>> GetFavoritesPhotos(int userId)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return _service.GetFavoritesPhotos(currentUserId);
        }

        [HttpGet]
        [Route("ids/{userId}")]
        public async Task<IEnumerable<int>> GetFavoritesIds(int userId)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return await _service.GetFavoritesPhotosId(currentUserId);
        }

        [HttpPost]
        public async Task<int> CreateFavorite([FromBody]Favorite favorite )
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            favorite.UserId = currentUserId;
            return await _service.CreateFavorite(favorite);
        }

        [HttpDelete("{userId}/{photoId}")]
        public async Task<int> DeleteFavorite(int userId, int photoId)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return await _service.DeleteFavorite(currentUserId, photoId);
        }

        [HttpDelete("selected/{userId}")]
        public async Task<int> DeleteSelectedFavorite(int userId, [FromBody]int[] photos)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return await _service.DeleteSelectedFavorites(currentUserId, photos);
        }

        [HttpDelete("{userId}")]
        public async Task<int> DeleteFavorites(int userId)
        {
            var currentUserEmail = this.GetUserEmail();
            var currentUserId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            return await _service.DeleteFavoritesForUser(currentUserId);
        }
    }
}