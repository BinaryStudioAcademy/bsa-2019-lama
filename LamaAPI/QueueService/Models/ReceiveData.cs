namespace QueueService.Models
{
    /// <summary>
    /// The data that Consumer receive
    /// </summary>
    public class ReceiveData
    {
        public ulong DeliveryTag { get; set; }
        public string Message { get; set; }
    }
}
