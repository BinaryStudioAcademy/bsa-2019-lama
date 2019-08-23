namespace Services.Implementation.RabbitMq
{
    public class ConnectionProvider : Interfaces.IConnectionProvider
    {
        private readonly RabbitMQ.Client.IConnectionFactory _connectionFactory;

        public ConnectionProvider(RabbitMQ.Client.IConnectionFactory connectionFactory)
        {
            _connectionFactory = connectionFactory;
        }

        public Interfaces.IConsumer Connect(Models.Settings settings)
        {
            return new Consumer(_connectionFactory, settings);
        }
        public Interfaces.IProducer Open(Models.Settings settings)
        {
            return new Producer(_connectionFactory, settings);
        }
    }
}
