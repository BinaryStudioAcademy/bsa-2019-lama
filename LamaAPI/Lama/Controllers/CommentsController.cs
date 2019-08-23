using System.Collections.Generic;
using System.Threading.Tasks;
using Lama.BusinessLogic.Interfaces;
using Lama.Domain.DTO.Comments;
using Microsoft.AspNetCore.Mvc;

namespace Lama.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        // FIELDS
        private readonly ICommentService commentService;

        // CONSTRUCTORS
        public CommentsController(ICommentService commentService)
        {
            this.commentService = commentService;
        }

        // METHODS
        // GET: api/comments/5
        [HttpGet("{photoId}")]
        public Task<IEnumerable<CommentListDTO>> FindPhotos(int photoId)
        {
            return commentService.GetAsync(photoId);
        }

        // POST: api/comments/
        [HttpPost]
        public Task<int> Create([FromBody]CreateCommentDTO createCommentDTO)
        {
            return commentService.CreateAsync(createCommentDTO);
        }

        // POST: api/comments/5
        [HttpDelete("{commentId}")]
        public Task Delete(int commentId)
        {
            return commentService.DeleteAsync(commentId);
        }

    }
}