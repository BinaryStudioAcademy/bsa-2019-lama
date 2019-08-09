using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Logging;
using Lama.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Lama.BusinessLogic.Services;
using Lama.DataAccess.Repositories;
using Lama.Domain.DbModels; 
using AutoMapper;
using Lama.BusinessLogic.MappingProfiles;

namespace Lama
{
    public class Startup
    {
        private static string Connection;
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            Connection = Configuration.GetConnectionString("ConnectionLocal");
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(o => o.AddPolicy("MyPolicy", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddDataAccessLayer(Configuration);
            services.AddQueueService(Configuration);
            services.AddBusinessLogicServices(Configuration);
            services.AddSiteAuthentications(Configuration);
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<UserProfile>();
            });
            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                IdentityModelEventSource.ShowPII = true;
                app.UseDeveloperExceptionPage();
            }
            else
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseCors("MyPolicy");

            app.UseMvc();
        }
    }
}
