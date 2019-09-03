using Services.Interfaces;
using Services.Models;

using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.MessagePatterns;
using System;

namespace Services.Implementation.RabbitMq
{
    public class Consumer : IConsumer
    {     
        private readonly IBroker _broker;
        private readonly EventingBasicConsumer _consumer;
        private readonly Settings _settings;

        public event EventHandler<BasicDeliverEventArgs> Received
        {
            add => _consumer.Received += value;
            remove => _consumer.Received -= value;
        }


        public Consumer(IConnectionFactory connectionFactory, Settings settings)
        {
            _broker = new Broker(connectionFactory, settings);
            _consumer = new EventingBasicConsumer(_broker.Channel);
            _settings = settings;
        }

        public void Connect()
        {
            _broker.Channel.BasicConsume(_settings.QueueName,
                false, _consumer);
        }

        public void Dispose()
        {
            _broker?.Dispose();
        }

        public void SetAcknowledge(ulong deliveryTag, bool processed)
        {
            if (processed)
            {
                _broker.Channel.BasicAck(deliveryTag, false);
            }
            else
            {
                _broker.Channel.BasicNack(deliveryTag, multiple: false, requeue: true);
            }
        }
    }
}
