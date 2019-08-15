namespace Lama.Domain.DTO.User
{
    public class GetUserDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? AvatarId { get; set; }
        public string Avatar { get; set; }
    }
}
