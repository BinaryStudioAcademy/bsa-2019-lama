namespace QueueService.Implementation.RabbitMq
{
    public class ConnectionProvider : Interfaces.IConnectionProvider
    {
        // FIELDS
        private readonly RabbitMQ.Client.IConnectionFactory connectionFactory;

        // CONSTRUCTORS
        public ConnectionProvider(RabbitMQ.Client.IConnectionFactory connectionFactory)
        {
            this.connectionFactory = connectionFactory;
        }

        // METHODS
        public Interfaces.IConsumer Connect(Models.Settings settings)
        {
            return new Consumer(connectionFactory, settings);
        }
        public Interfaces.IProducer Open(Models.Settings settings)
        {
            return new Producer(connectionFactory, settings);
        }
    }
}
