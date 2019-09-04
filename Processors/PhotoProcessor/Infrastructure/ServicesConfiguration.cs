using Unity;
using Nest;
using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Processors.Domain.BlobModel;
using Processors.Domain.Settings;
using Processors.DataAccess.Implementation;
using Processors.DataAccess.Interfaces;
using Processors.BusinessLogic.Interfaces;
using Processors.BusinessLogic.Services;
using Processors.DataAccess.Implementations;
using Services.Models;
using Services.Interfaces;
using Services.Implementation.RabbitMq;
using RabbitMQ.Client;
using Serilog;
using Serilog.Exceptions;
using Serilog.Sinks.Elasticsearch;
using NestConnection = Nest.ConnectionSettings;
using QueueConnection = Services.Models.ConnectionSettings;

namespace PhotoProcessor.Infrastructure
{
    internal class ServicesConfiguration
    {
        static readonly ServicesConfiguration instance;

        private readonly IUnityContainer _container;
        private readonly IConfiguration _configuration;

        private ServicesConfiguration()
        {
            _container = new UnityContainer();
            _configuration = new ConfigurationBuilder()
                                .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                                .AddJsonFile("appsettings.json")
                                .AddEnvironmentVariables()
                                .Build();
            var elasticUri = _configuration["elasticsearch:url"];

            Log.Logger = new LoggerConfiguration()
                .Enrich.FromLogContext()
                .Enrich.WithExceptionDetails()
                .WriteTo.Elasticsearch(new ElasticsearchSinkOptions(new Uri(elasticUri))
                {
                    AutoRegisterTemplate = true,
                })
                .CreateLogger();

            Configure();
        }
        static ServicesConfiguration()
        {
            instance = new ServicesConfiguration();
        }

        private void Configure()
        {
            _container.RegisterFactory<IConnectionFactory>(f => new DefaultConnectionFactory(_configuration.Bind<QueueConnection>("Queues:ConnectionSettings")));
            _container.RegisterType<IConnectionProvider, ConnectionProvider>();

            _container.RegisterFactory<IElasticStorage>(ElasticStorageFactory);
            _container.RegisterFactory<IPhotoBlobStorage>(f => new PhotoBlobStore(_configuration.Bind<CreateBlobStorageSettings>("BlobStorageSettings")));
            _container.RegisterFactory<ImageCompareService>(f =>
                new ImageCompareService(_container.Resolve<IElasticStorage>()));
            _container.RegisterFactory<ICognitiveService>(CognitiveServiceFactory);
            _container.RegisterType<IImageProcessingService, ImageProcessingService>();
            _container.RegisterFactory<IMessageService>(MessageServiceFactory);
        }

        private IElasticStorage ElasticStorageFactory(IUnityContainer unityContainer)
        {
            var url = _configuration["elasticsearch:url"];
            var defaultIndex = _configuration["elasticsearch:index"];
            var uri = new Uri(url);

            var settings = new NestConnection(uri)
                .DefaultIndex(defaultIndex)
                .DefaultMappingFor<PhotoDocument>(m => m.IdProperty(p => p.Id));

            return new ElasticStorage(defaultIndex, new ElasticClient(settings));
        }
        private IMessageService MessageServiceFactory(IUnityContainer unityContainer)
        {
            var elasticStorage = unityContainer.Resolve<IElasticStorage>();
            var photoBlobStorage = unityContainer.Resolve<IPhotoBlobStorage>();

            var cognitiveService = unityContainer.Resolve<ICognitiveService>();
            var imageProcessingService = unityContainer.Resolve<IImageProcessingService>();
                        
            var consumer = unityContainer.Resolve<IConnectionProvider>().Connect
                (_configuration.Bind<Settings>("Queues:FromPhotoToPhotoProcessor"));
            var producer = unityContainer.Resolve<IConnectionProvider>().Open
                (_configuration.Bind<Settings>("Queues:FromPhotoProcessorToPhotoAPI"));
            var categoryProducer = unityContainer.Resolve<IConnectionProvider>().Open(
                _configuration.Bind<Settings>("Queues:FromPhotoProcessorImageCategoryToPhotoAPI"));
            

            var comparer = unityContainer.Resolve<ImageCompareService>();
            return new MessageServices(imageProcessingService, cognitiveService, elasticStorage, photoBlobStorage, consumer, producer, categoryProducer,comparer);
        }

        private ICognitiveService CognitiveServiceFactory(IUnityContainer unityContainer)
        {
            var url = _configuration["cognitiveServiceEndpoint"];
            var key = _configuration["cognitiveEndpointKey"];
            Log.Logger.Error(key);
            
            return new CognitiveService(url,key);
        }

        public IUnityContainer Container => _container;
        public static ServicesConfiguration Instance => instance;
    }
}
