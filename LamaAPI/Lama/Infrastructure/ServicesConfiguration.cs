using Microsoft.Extensions.DependencyInjection;

using RabbitMQ.Client;

using QueueService.Interfaces;
using QueueService.Implementation.RabbitMq;

namespace Lama.Infrastructure
{
    public static class ServicesConfiguration
    {
        public static void AddQueueService(this IServiceCollection services)
        {
            services.AddSingleton<IConnectionFactory, DefaultConnectionFactory>();
            services.AddSingleton<IConnectionProvider, ConnectionProvider>();
        }
    }
}
