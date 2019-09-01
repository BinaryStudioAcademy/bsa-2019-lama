using System;
using RabbitMQ.Client.Events;

namespace Services.Interfaces
{
    public interface IConsumer : System.IDisposable
    {
        Models.ReceiveData Receive(int millisecondsTimeout);
        void SetAcknowledge(ulong deliveryTag, bool processed);
    }
}