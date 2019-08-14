namespace Lama.Domain.DTO.Comments
{
    public class CreateCommentDTO
    {
        public string Text { get; set; }
        public int PhotoId { get; set; }
        public int UserId { get; set; }
    }
}
