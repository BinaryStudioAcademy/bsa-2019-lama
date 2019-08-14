namespace Photo.Domain.DataTransferObjects
{
    public class CreatePhotoDTO
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public string Description { get; set; }
        public int AuthorId { get; set; }
        public string FileName { get; set; }
    }
}
