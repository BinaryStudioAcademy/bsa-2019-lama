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
using Lama.DataAccess.Repositories;
using Lama.Domain.DbModels;
using Lama.BusinessLogic.Interfaces;

namespace Lama.Infrastructure
{
    public static class ServicesConfiguration
    {
        public static void AddQueueService(this IServiceCollection services, IConfiguration configuration)
        {            
            services.AddSingleton<IConnectionFactory, DefaultConnectionFactory>();
            services.AddSingleton<IConnectionProvider, ConnectionProvider>();
        }
        public static void AddDataAccessLayer(this IServiceCollection services, IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("ConnectionLocal");

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(connectionString), ServiceLifetime.Scoped);

            services.AddScoped<IUnitOfWork, UnitOfWork>();
        }
        public static void AddBusinessLogicServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<PhotoService>(f => new PhotoService(configuration["PhotoApiUrl"], services.BuildServiceProvider().GetRequiredService<IUnitOfWork>()));
            services.AddScoped<UserService>();
            services.AddScoped(serviceProvider => new SharingPhotoService(configuration["PhotoApiUrl"],
                                                    serviceProvider.GetService<ApplicationDbContext>()) );
        }
        public static void AddServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped<IAlbumService, AlbumService>();
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
