using System.Collections.Generic;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DTO.Comments;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentService commentService;

        public CommentsController(ICommentService commentService)
        {
            this.commentService = commentService;
        }

        [HttpGet("{photoId}")]
        public Task<IEnumerable<CommentListDTO>> FindPhotos(int photoId)
        {
            return commentService.GetAsync(photoId);
        }

        [HttpPost]
        public Task<int> Create([FromBody]CreateCommentDTO createCommentDTO)
        {
            return commentService.CreateAsync(createCommentDTO);
        }

        [HttpDelete("{commentId}")]
        public Task Delete(int commentId)
        {
            return commentService.DeleteAsync(commentId);
        }

    }
}