using System;
using RabbitMQ.Client.Events;

namespace Services.Interfaces
{
    public interface IConsumer : System.IDisposable
    {
        event EventHandler<BasicDeliverEventArgs> Received;
        void SetAcknowledge(ulong deliveryTag, bool processed);
        void Connect();
    }
}