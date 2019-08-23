using RabbitMQ.Client;

namespace Services.Implementation.RabbitMq
{
    public class Broker : Interfaces.IBroker
    {
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public Broker(IConnectionFactory connectionFactory, Models.Settings settings)
        {
            _connection = connectionFactory.CreateConnection();
            _channel = _connection.CreateModel();

            DeclareExchange(settings.ExchangeName, settings.ExchangeType);

            if (settings.QueueName != null)
            {
                BindQueue(settings.ExchangeName, settings.QueueName, settings.RoutingKey);
            }
        }
        public void Dispose()
        {
            _channel?.Dispose();
            _connection?.Dispose();
        }

        public IModel Channel => _channel;

        public void DeclareExchange(string exchangeName, string exchangeType)
        {
            _channel.ExchangeDeclare(exchangeName, exchangeType ?? string.Empty);
        }
        public void BindQueue(string exchangeName, string queueName, string routingKey)
        {
            _channel.QueueDeclare(queueName, durable: false, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueBind(queueName, exchangeName, routingKey);
        }
    }
}
