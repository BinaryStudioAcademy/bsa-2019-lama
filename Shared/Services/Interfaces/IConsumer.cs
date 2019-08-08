namespace Services.Interfaces
{
    public interface IConsumer : System.IDisposable
    {
        event System.EventHandler<Models.ReceiveData> Received;

        Models.ReceiveData Receive(int millisecondsTimeout);
        void SetAcknowledge(ulong deliveryTag, bool processed);
    }
}