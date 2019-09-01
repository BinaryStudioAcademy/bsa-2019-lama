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
        private readonly ISubscription _subscription;



        public Consumer(IConnectionFactory connectionFactory, Settings settings)
        {
            _broker = new Broker(connectionFactory, settings);
            _subscription = new Subscription(_broker.Channel, settings.QueueName, autoAck: false);
        }


        public void Dispose()
        {
            _broker?.Dispose();
            _subscription?.Dispose();
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

        public ReceiveData Receive(int millisecondsTimeout)
        {
            if (_subscription.Next(millisecondsTimeout, out BasicDeliverEventArgs basicDeliveryEventArgs))
            {
                return new ReceiveData
                {
                    DeliveryTag = basicDeliveryEventArgs.DeliveryTag,
                    Body = basicDeliveryEventArgs.Body
                };
            }

            return null;
        }
    }
}
