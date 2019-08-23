namespace Services.Models
{
    /// <summary>
    /// The data that Consumer receive
    /// </summary>
    public class ReceiveData
    {
        public ulong DeliveryTag { get; set; }
        public byte[] Body { private get; set; }
        public string Message => System.Text.Encoding.UTF8.GetString(Body);
    }
}
