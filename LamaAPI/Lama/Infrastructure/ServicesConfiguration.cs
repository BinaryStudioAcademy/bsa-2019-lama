using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using RabbitMQ.Client;
using Services.Interfaces;
using Services.Implementation.RabbitMq;
using Lama.DataAccess;
using Lama.DataAccess.Interfaces;
using Lama.BusinessLogic.Services;
using Lama.BusinessLogic.Interfaces;
using AutoMapper;
using Lama.Domain.MappingProfiles;
using Microsoft.AspNetCore.SignalR;
using Lama.BusinessLogic.Hubs;

namespace Lama.Infrastructure
{
    public static class ServicesConfiguration
    {
        public static void AddQueueService(this IServiceCollection services, IConfiguration configuration)
        {            
            services.AddSingleton<IConnectionFactory, DefaultConnectionFactory>();
            services.AddSingleton<IConnectionProvider, ConnectionProvider>();
        }
        public static void AddMapper(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAutoMapper(typeof(UserProfile).Assembly);

        }
        public static void AddDataAccessLayer(this IServiceCollection services, IConfiguration configuration)
        {
            string connectionString = configuration["ConnectionStrings:ConnectionLocal"];

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString), ServiceLifetime.Scoped);

            services.AddScoped<IUnitOfWork, UnitOfWork>();
        }
        public static void AddBusinessLogicServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<ILocationService, LocationService>();
            services.AddScoped<INotificationService, NotificationService>();
            services.AddScoped<UserService>();
            services.AddScoped<IPhotoService, PhotoService>(f => new PhotoService(f.GetService<ApplicationDbContext>(),configuration["PhotoApiUrl"], f.GetRequiredService<IUnitOfWork>(), f.GetService<IMapper>(),f.GetService<INotificationService>(), f.GetService<ILocationService>(),f.GetService<IHubContext<NotificationHub>>()));
            services.AddScoped<IPhotoDetailsService, PhotoDetailsService>(f => new PhotoDetailsService(configuration["PhotoApiUrl"], f.GetRequiredService<IUnitOfWork>(), f.GetService<IMapper>(), f.GetService<ApplicationDbContext>(), f.GetService<ILocationService>()));
            services.AddScoped<IAlbumService, AlbumService>();
            services.AddScoped<IFavoriteService, FavoriteService>();
            services.AddScoped<ICommentService, CommentService>();
            services.AddScoped<SharingAlbumService>();
            services.AddScoped<IUserProtectionService, UserProtectionService>();

            services.AddScoped<ISharingPhotoService, SharingPhotoService>(serviceProvider => 
                new SharingPhotoService(
                    serviceProvider.GetService<ApplicationDbContext>(),
                    serviceProvider.GetService<IMapper>(),
                    serviceProvider.GetService<IPhotoService>(),
                    configuration["PhotoApiUrl"]));
        }
        public static void AddSiteAuthentications(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            })
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.Authority = configuration["FirebaseOptions:Authority"];
                    options.IncludeErrorDetails = true;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = configuration["FirebaseOptions:Issuer"],
                        ValidateAudience = true,
                        ValidAudience = configuration["FirebaseOptions:Audience"],
                        ValidateLifetime = true
                    };
                });
            
        }
    }
}
