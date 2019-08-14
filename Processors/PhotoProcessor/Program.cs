using Unity;

using PhotoProcessor.Infrastructure;
using Processors.BusinessLogic.Interfaces;

namespace PhotoProcessor
{
    class Program
    {
        static void Main(string[] args)
        {
            using (IMessageService messageService = ServicesConfiguration.Instance.Container.Resolve<IMessageService>())
            {
                messageService.RunAsync().GetAwaiter().GetResult();
            }                  
        }
    }
}
