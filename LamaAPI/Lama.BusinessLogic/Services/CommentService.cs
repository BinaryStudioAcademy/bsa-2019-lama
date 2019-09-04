using Lama.BusinessLogic.Interfaces;
using Lama.DataAccess.Interfaces;
using Lama.Domain.DbModels;
using Lama.Domain.DTO.Comments;

using System.Linq;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AutoMapper;
using Lama.DataAccess;
using Lama.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Lama.BusinessLogic.Services
{
    public class CommentService : ICommentService
    {
        // FIELDS
        IUnitOfWork unitOfWork;
        IPhotoService photoService;
        IMapper mapper;
        ApplicationDbContext Context;
        INotificationService notificationService;
        // CONSTRUCTORS
        public CommentService(ApplicationDbContext Context,IUnitOfWork unitOfWork, IPhotoService photoService, IMapper mapper, INotificationService notificationService)
        {
            this.unitOfWork = unitOfWork;
            this.photoService = photoService;
            this.mapper = mapper;
            this.Context = Context;
            this.notificationService = notificationService;
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

                if (comments[i].User.AvatarUrl != null)
                {
                    commentLists[i].AuthorAvatar64Id =
                        (await photoService.GetAvatar(Path.GetFileName(comments[i].User.AvatarUrl)));
                }
            }

            return commentLists;
        }

        public async Task<int> CreateAsync(CreateCommentDTO createCommentDTO)
        {
            Comment comment = mapper.Map<Comment>(createCommentDTO);

            await unitOfWork.GetRepository<Comment>().InsertAsync(comment);
            await unitOfWork.SaveAsync();

            var photo  = await Context.Photos.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == createCommentDTO.PhotoId);          
            var user = photo.User;
            var ID = user.Id;
            if(user.Id != createCommentDTO.UserId)
            {
                user = await Context.Users.FirstOrDefaultAsync(x => x.Id == createCommentDTO.UserId);
                string noti = "Commented your photo";
                await notificationService.SendNotification(ID, user, noti, ActivityType.Comment);
            }
            return comment.Id;
        }
        public async Task DeleteAsync(int commentId)
        {
            await unitOfWork.GetRepository<Comment>().DeleteAsync(commentId);
            await unitOfWork.SaveAsync();
        }
    }
}
