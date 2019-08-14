using Lama.Domain.DTO.Comments;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lama.BusinessLogic.Interfaces
{
    public interface ICommentService
    {
        Task<IEnumerable<CommentListDTO>> GetAsync(int photoId);
        Task<int> CreateAsync(CreateCommentDTO createCommentDTO);
        Task DeleteAsync(int commentId);
    }
}
