using QueueService.Interfaces;
using QueueService.Models;

using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using RabbitMQ.Client.MessagePatterns;

namespace QueueService.Implementation.RabbitMq
{
    public class Consumer : IConsumer
    {
        // FIELDS        
        private readonly IBroker broker;

        private readonly ISubscription subscription;
        private readonly EventingBasicConsumer consumer;

        // CONSTRUCTORS
        public Consumer(IConnectionFactory connectionFactory, Settings settings)
        {
            this.broker = new Broker(connectionFactory, settings);

            this.consumer = new EventingBasicConsumer(broker.Channel);
            this.consumer.Received += Consumer_Received;
            broker.ConfigureConsumer(settings.QueueName, this.consumer);
            
            this.subscription = new Subscription(broker.Channel, settings.QueueName, autoAck: false);
        }

        private void Consumer_Received(object sender, BasicDeliverEventArgs e)
        {
            OnDataReceived(new ReceiveData
            {
                DeliveryTag = e.DeliveryTag,
                Message = System.Text.Encoding.UTF8.GetString(e.Body)
            });
        }

        public void Dispose()
        {
            broker?.Dispose();
            subscription?.Dispose();
        }

        // EVENTS
        public event System.EventHandler<ReceiveData> Received;

        // METHODS
        public void SetAcknowledge(ulong deliveryTag, bool processed)
        {
            if (processed)
            {
                broker.Channel.BasicAck(deliveryTag, false);
            }
            else
            {
                broker.Channel.BasicNack(deliveryTag, multiple: false, requeue: true);
            }
        }

        public ReceiveData Receive(int millisecondsTimeout)
        {
            if (subscription.Next(millisecondsTimeout, out BasicDeliverEventArgs basicDeliveryEventArgs))
            {
                return new ReceiveData
                {
                    DeliveryTag = basicDeliveryEventArgs.DeliveryTag,
                    Message = System.Text.Encoding.UTF8.GetString(basicDeliveryEventArgs.Body)
                };
            }
            else return null;
        }
        protected virtual void OnDataReceived(ReceiveData receiveDataArgs)
        {
            Received?.Invoke(this, receiveDataArgs);
        }
    }
}
