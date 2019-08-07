namespace Services.Models
{
    /// <summary>
    /// Settings that should specify both sides (producer and consumer)
    /// </summary>
    public class Settings
    {
        public string ExchangeName { get; set; }
        public string QueueName { get; set; }
        public string RoutingKey { get; set; }
        public string ExchangeType { get; set; }
    }
}
