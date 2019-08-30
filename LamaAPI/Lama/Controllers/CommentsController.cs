using System.Collections.Generic;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DTO.Comments;
using Lama.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly IUserProtectionService _userProtectionService;

        public CommentsController(ICommentService commentService, IUserProtectionService userProtectionService)
        {
            _commentService = commentService;
            _userProtectionService = userProtectionService;
        }

        [HttpGet("{photoId}")]
        public Task<IEnumerable<CommentListDTO>> FindPhotos(int photoId)
        {
            return _commentService.GetAsync(photoId);
        }

        [HttpPost]
        public Task<int> Create([FromBody]CreateCommentDTO createCommentDTO)
        {
            var currentUserEmail = this.GetUserEmail();
            var userId = _userProtectionService.GetCurrentUserId(currentUserEmail);
            createCommentDTO.UserId = userId;
            return _commentService.CreateAsync(createCommentDTO);
        }

        [HttpDelete("{commentId}")]
        public Task Delete(int commentId)
        {
            return _commentService.DeleteAsync(commentId);
        }
    }
}