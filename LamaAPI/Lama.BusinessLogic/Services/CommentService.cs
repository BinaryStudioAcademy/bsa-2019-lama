using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess.Interfaces;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Comments;

using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;

namespace Lama.BusinessLogic.Services
{
    public class CommentService : ICommentService
    {
        // FIELDS
        IUnitOfWork unitOfWork;
        IPhotoService photoService;
        IMapper mapper;

        // CONSTRUCTORS
        public CommentService(IUnitOfWork unitOfWork, IPhotoService photoService, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.photoService = photoService;
            this.mapper = mapper;
        }

        // METHODS
        public async Task<IEnumerable<CommentListDTO>> GetAsync(int photoId)
        {
            // get comments
            Comment[] comments = (await unitOfWork.GetRepository<Comment>().GetAsync(
                filter: c => c.PhotoId == photoId,
                includeProperties: string.Join(',', nameof(Comment.Photo), nameof(Comment.User))))
                .ToArray();

            // map to dto
            CommentListDTO[] commentLists = new CommentListDTO[comments.Length];
            for(int i = 0; i < comments.Length; ++i)
            {
                commentLists[i] = mapper.Map<CommentListDTO>(comments[i]);
                commentLists[i].AuthorAvatar64Url = (await photoService.Get(comments[i].PhotoId)).Blob64Id;
            }

            return commentLists;
        }

        public async Task<int> CreateAsync(CreateCommentDTO createCommentDTO)
        {
            Comment comment = mapper.Map<Comment>(createCommentDTO);

            await unitOfWork.GetRepository<Comment>().InsertAsync(comment);
            await unitOfWork.SaveAsync();

            return comment.Id;
        }
        public async Task DeleteAsync(int commentId)
        {
            await unitOfWork.GetRepository<Comment>().DeleteAsync(commentId);
            await unitOfWork.SaveAsync();
        }
    }
}
