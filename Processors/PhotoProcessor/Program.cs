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
			var messageService = ServicesConfiguration.Instance.Container.Resolve<IMessageService>();
           messageService.Run();
        }
    }
}
