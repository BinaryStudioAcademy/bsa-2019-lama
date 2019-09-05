using System;
using Unity;
using PhotoProcessor.Infrastructure;
using Processors.BusinessLogic.Interfaces;

namespace PhotoProcessor
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var messageService = ServicesConfiguration.Instance.Container.Resolve<IMessageService>())
            {
                messageService.Run();
                Console.ReadLine();
            }                  
        }
    }
}
