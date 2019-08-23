using Services.Interfaces;
using Services.Models;

using RabbitMQ.Client;

namespace Services.Implementation.RabbitMq
{
    public class Producer : IProducer
    {
        // FIELDS
        private readonly PublicationAddress publicationAddress;

        private IBroker broker;

        // CONSTRUCTORS
        public Producer(IConnectionFactory connectionFactory, Settings settings)
        {
            this.broker = new Broker(connectionFactory, settings);

            this.publicationAddress = new PublicationAddress(
                    settings.ExchangeType,
                    settings.ExchangeName,
                    settings.RoutingKey);
        }

        public void Dispose()
        {
            broker?.Dispose();
        }

        // PROPERTIES
        public IModel Channel => broker.Channel;

        // METHODS
        public void Send(byte[] body)
        {
            Channel.BasicPublish(publicationAddress, null, body);
        }
        public void Send(string message)
        {
            byte[] body = System.Text.Encoding.UTF8.GetBytes(message);

            Channel.BasicPublish(publicationAddress, null, body);
        }

    }
}
