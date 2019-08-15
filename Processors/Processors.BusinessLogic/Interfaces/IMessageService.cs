namespace Processors.BusinessLogic.Interfaces
{
    public interface IMessageService : System.IDisposable
    {
        System.Threading.Tasks.Task RunAsync(int millisecondsTimeout);
    }
}
