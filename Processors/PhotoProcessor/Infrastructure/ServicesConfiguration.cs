using Unity;

using Nest;

using System;

using Microsoft.Extensions.Configuration;

using Processors.Domain.BlobModel;
using Processors.Domain.Settings;

using Processors.DataAccess.Implementation;
using Processors.DataAccess.Interfaces;

using Processors.BusinessLogic.Interfaces;
using Processors.BusinessLogic.Services;

using Services.Models;
using Services.Interfaces;
using Services.Implementation.RabbitMq;
using RabbitMQ.Client;


using NestConnection = Nest.ConnectionSettings;
using QueueConnection = Services.Models.ConnectionSettings;

namespace PhotoProcessor.Infrastructure
{
    // singleton
    internal class ServicesConfiguration
    {
        // FIELDS
        static ServicesConfiguration instance;

        IUnityContainer container;
        IConfiguration configuration;

        // CONSTRUCTORS
        ServicesConfiguration()
        {
            container = new UnityContainer();
            configuration = new ConfigurationBuilder()
                                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                                .AddJsonFile("appsettings.json")
                                .Build();

            Configure();
        }
        static ServicesConfiguration()
        {
            instance = new ServicesConfiguration();
        }

        private void Configure()
        {
            container.RegisterFactory<IConnectionFactory>(f => new DefaultConnectionFactory(configuration.Bind<QueueConnection>("Queues:ConnectionSettings")));
            container.RegisterType<IConnectionProvider, ConnectionProvider>();

            container.RegisterFactory<IElasticStorage>(ElasticStorageFactory);
            container.RegisterFactory<IPhotoBlobStorage>(f => new PhotoBlobStore(configuration.Bind<CreateBlobStorageSettings>("BlobStorageSettings")));

            container.RegisterType<IImageProcessingService, ImageProcessingService>();
            container.RegisterFactory<IMessageService>(MessageServiceFactory);
        }

        private IElasticStorage ElasticStorageFactory(IUnityContainer unityContainer)
        {
            string url = configuration["elasticsearch:url"];
            string defaultIndex = configuration["elasticsearch:index"];
            Uri uri = new Uri(url);

            NestConnection settings = new NestConnection(uri)
                .DefaultIndex(defaultIndex)
                .DefaultMappingFor<PhotoDocument>(m => m.IdProperty(p => p.Id));

            return new ElasticStorage(defaultIndex, new ElasticClient(settings));
        }
        private IMessageService MessageServiceFactory(IUnityContainer unityContainer)
        {
            IElasticStorage elasticStorage = unityContainer.Resolve<IElasticStorage>();
            IPhotoBlobStorage photoBlobStorage = unityContainer.Resolve<IPhotoBlobStorage>();

            IImageProcessingService imageProcessingService = unityContainer.Resolve<IImageProcessingService>();
                        
            IConsumer consumer = unityContainer.Resolve<IConnectionProvider>().Connect
                (configuration.Bind<Settings>("Queues:FromPhotoToPhotoProcessor"));

            return new MessageServices(imageProcessingService, elasticStorage, photoBlobStorage, consumer);
        }

        // PROPERTIES
        public IUnityContainer Container => container;
        public static ServicesConfiguration Instance => instance;
    }
}
