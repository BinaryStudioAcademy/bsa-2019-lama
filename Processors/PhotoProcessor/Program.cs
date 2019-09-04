using System;
using Unity;

using PhotoProcessor.Infrastructure;
using Processors.BusinessLogic.Interfaces;

namespace PhotoProcessor
{
    class Program
    {
        public static readonly int CheckForMessageEashMs = 2500;

        static void Main(string[] args)
        {
            using (var messageService = ServicesConfiguration.Instance.Container.Resolve<IMessageService>())
            {
                messageService.RunAsync(CheckForMessageEashMs).GetAwaiter().GetResult();
                Console.ReadLine();
            }                  
        }
    }
}
