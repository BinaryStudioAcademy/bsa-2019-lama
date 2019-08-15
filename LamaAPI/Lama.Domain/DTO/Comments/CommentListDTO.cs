namespace Lama.Domain.DTO.Comments
{
    public class CommentListDTO
    {
        public int CommentId { get; set; }

        public int AuthorId { get; set; }
        public string AuthorAvatar64Url { get; set; }
        public string AuthorFirstName { get; set; }
        public string AuthorLastName { get; set; }

        public string CommentText { get; set; }
    }
}
