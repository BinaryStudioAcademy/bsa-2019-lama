using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using RabbitMQ.Client;
using Services.Models;
using Services.Interfaces;
using Services.Implementation.RabbitMq;
using System;
using System.Data.SqlClient;
using Nest;
using Photo.Domain.Settings;
using Photo.Domain.BlobModels;
using Photo.Domain.MappingProfiles;
using Photo.BusinessLogic.Services;
using Photo.BusinessLogic.Interfaces;
using Photo.DataAccess.Implementation;
using Photo.DataAccess.Interfaces;
using Photo.Infrastructure;
using AutoMapper;
using Microsoft.Azure.Storage;
using Serilog;
using NestConnectionSettings = Nest.ConnectionSettings;
using QueueConnectionSettings = Services.Models.ConnectionSettings;

namespace Photo.Infrastructure
{
	public static class ServicesConfiguration
	{
		public static void AddQueueService(this IServiceCollection services, IConfiguration configuration)
		{
			services.AddSingleton<IConnectionFactory, DefaultConnectionFactory>(
				f => new DefaultConnectionFactory(configuration.Bind<QueueConnectionSettings>("Queues:ConnectionSettings")));
			services.AddSingleton<IConnectionProvider, ConnectionProvider>();
		}

		public static void AddElasticSearch(this IServiceCollection services, IConfiguration configuration)
		{
			string url = configuration["elasticsearch:url"];
			string defaultIndex = configuration["elasticsearch:index"];
			Uri uri = new Uri(url);

			NestConnectionSettings settings = new NestConnectionSettings(uri)
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
			var blobEndpointUrl =
				CloudStorageAccount.Parse(configuration.Bind<CreateBlobStorageSettings>("BlobStorageSettings")
						.ConnectionString)
					.BlobEndpoint.ToString();
			services.AddScoped<DuplicatesService>(serviceProvider => new DuplicatesService(
				serviceProvider.GetService<IElasticStorage>(),
				serviceProvider.GetService<IMapper>(),
				configuration));
			services.AddScoped<IMessageService, MessageService>(serviceProvider => MessageServiceFactory(serviceProvider, configuration));

			services.AddScoped<IPhotoBlobStorage, PhotoBlobStore>(
				f => new PhotoBlobStore(configuration.Bind<CreateBlobStorageSettings>("BlobStorageSettings")));
			services.AddScoped<ImageCompareService>();
			services.AddScoped<ImageProcessingService>();
			services.AddScoped<IPhotoService, PhotoService>(serviceProvider =>
				new PhotoService(
					serviceProvider.GetService<IElasticStorage>(),
					serviceProvider.GetService<IPhotoBlobStorage>(),
					serviceProvider.GetService<IMessageService>(),
					serviceProvider.GetService<IMapper>(),
					serviceProvider.GetService<ImageCompareService>(),
					blobEndpointUrl,
					configuration));
		}

		private static MessageService MessageServiceFactory(IServiceProvider serviceProvider, IConfiguration configuration)
		{
			Log.Logger.Error($"{configuration["LamaApiUrl"]} lama api url");
			var connectionProvider = serviceProvider.GetService<IConnectionProvider>();

			var messageServiceSettings = new MessageServiceSettings()
			{
				PhotoProcessorConsumer = connectionProvider.Connect(configuration.Bind<Settings>("Queues:FromPhotoProcessorToPhotoAPI")),
				PhotoProcessorProducer = connectionProvider.Open(configuration.Bind<Settings>("Queues:FromPhotoToPhotoProcessor"))
			};

			return new MessageService(messageServiceSettings,
                serviceProvider.GetService<DuplicatesService>(),
                serviceProvider.GetService<ImageProcessingService>(), 
                serviceProvider.GetService<ImageCompareService>(),
                serviceProvider.GetService<IElasticStorage>());
		}
	}
}
