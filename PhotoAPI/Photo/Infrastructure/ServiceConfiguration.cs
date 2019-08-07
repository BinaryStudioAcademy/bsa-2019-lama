using Microsoft.Extensions.DependencyInjection;

using RabbitMQ.Client;

using Services.Interfaces;
using Services.Implementation.RabbitMq;

namespace Photo.Infrastructure
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
