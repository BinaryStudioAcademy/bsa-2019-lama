namespace Photo.Domain.DataTransferObjects
{
    // use this to send to server
    // which photo should be delted or restored
    public class PhotoToDeleteRestoreDTO
    {
        public int Id { get; set; }
    }
}
