using Services.Interfaces;
using Services.Models;

using RabbitMQ.Client;

namespace Services.Implementation.RabbitMq
{
    public class Producer : IProducer
    {
        private readonly PublicationAddress _publicationAddress;
        private readonly IBroker _broker;

        public Producer(IConnectionFactory connectionFactory, Settings settings)
        {
            _broker = new Broker(connectionFactory, settings);
            _publicationAddress = new PublicationAddress(
                    settings.ExchangeType,
                    settings.ExchangeName,
                    settings.RoutingKey);
        }

        public void Dispose()
        {
            _broker?.Dispose();
        }

        private IModel Channel => _broker.Channel;

        public void Send(byte[] body)
        {
            Channel.BasicPublish(_publicationAddress, null, body);
        }
        public void Send(string message)
        {
            var body = System.Text.Encoding.UTF8.GetBytes(message);

            Channel.BasicPublish(_publicationAddress, null, body);
        }
    }
}
