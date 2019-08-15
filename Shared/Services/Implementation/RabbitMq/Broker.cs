using RabbitMQ.Client;

namespace Services.Implementation.RabbitMq
{
    public class Broker : Interfaces.IBroker
    {
        // FIELDS
        private readonly IConnection connection;
        private readonly IModel channel;

        // CONSTRUCTORS
        public Broker(IConnectionFactory connectionFactory, Models.Settings settings)
        {
            connection = connectionFactory.CreateConnection();
            channel = connection.CreateModel();

            // establish connection
            DeclareExchange(settings.ExchangeName, settings.ExchangeType);

            if (settings.QueueName != null)
            {
                BindQueue(settings.ExchangeName, settings.QueueName, settings.RoutingKey);
            }

        }
        public void Dispose()
        {
            channel?.Dispose();
            connection?.Dispose();
        }

        // PROPERTIES
        public IModel Channel => channel;

        // METHODS
        public void DeclareExchange(string exchangeName, string exchangeType)
        {
            channel.ExchangeDeclare(exchangeName, exchangeType ?? string.Empty);
        }
        public void BindQueue(string exchangeName, string queueName, string routingKey)
        {
            channel.QueueDeclare(queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
            channel.QueueBind(queueName, exchangeName, routingKey);
        }
    }
}
