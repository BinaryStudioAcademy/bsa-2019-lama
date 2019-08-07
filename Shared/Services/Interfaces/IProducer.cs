namespace Services.Interfaces
{
    public interface IProducer : System.IDisposable
    {
        void Send(byte[] body);
        void Send(string message);
    }
}