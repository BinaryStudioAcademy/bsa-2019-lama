namespace Services.Interfaces
{
    public interface IConnectionProvider
    {
        IConsumer Connect(Models.Settings settings);
        IProducer Open(Models.Settings settings);
    }
}