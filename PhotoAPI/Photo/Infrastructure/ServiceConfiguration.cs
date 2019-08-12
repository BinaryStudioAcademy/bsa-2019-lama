using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;
using Services.Interfaces;
using Services.Implementation.RabbitMq;
using System;
using Nest;
using Photo.Domain.BlobModels;
using Photo.BusinessLogic.Services;
using Photo.BusinessLogic.Interfaces;
using Photo.DataAccess.Implementation;
using Photo.DataAccess.Interfaces;
using AutoMapper;
using Photo.Domain.MappingProfiles;

namespace Photo.Infrastructure
{
    public static class ServicesConfiguration
    {
        public static void AddQueueService(this IServiceCollection services)
        {
            services.AddSingleton<IConnectionFactory, DefaultConnectionFactory>();
            services.AddSingleton<IConnectionProvider, ConnectionProvider>();
        }

        public static void AddElasticSearch(this IServiceCollection services, IConfiguration configuration)
        {
            string url = configuration["elasticsearch:url"];
            string defaultIndex = configuration["elasticsearch:index"];
            Uri uri = new Uri(url);

            ConnectionSettings settings = new ConnectionSettings(uri)
                .DefaultIndex(defaultIndex)
                .DefaultMappingFor<PhotoDocument>(m => m.IdProperty(p => p.Id));
                
            
            services.AddSingleton<IElasticClient>(new ElasticClient(settings));
            services.AddSingleton<IElasticStorage>(f => new ElasticStorage(defaultIndex, f.GetService<IElasticClient>()));
        }
        public static void AddMapper(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAutoMapper(typeof(PhotoProfile).Assembly);
        }
        public static void AddBusinessLogicServices(this IServiceCollection services, IConfiguration configuration)
        {
            CreateBlobStorageSettings createBlobStorageSettings = new CreateBlobStorageSettings();
            configuration.Bind("BlobStorageSettings", createBlobStorageSettings);

            services.AddScoped<IPhotoBlobStorage, PhotoBlobStore>(f => new PhotoBlobStore(createBlobStorageSettings));

            services.AddScoped<IPhotoService, PhotoService>();
        }
    }
}
