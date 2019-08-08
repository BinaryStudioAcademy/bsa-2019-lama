using Microsoft.AspNetCore.Builder;
using Lama.DataAccess;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Logging;
using Lama.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

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
            services.AddScoped<BusinessLogic.Services.PhotoService>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Connection));

            services.AddScoped<DALInstanse>();
            services.AddQueueService();

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
                    options.Authority = Configuration["FirebaseOptions:Authority"];
                    options.IncludeErrorDetails = true;

                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidIssuer = Configuration["FirebaseOptions:Issuer"],
                        ValidateAudience = true,
                        ValidAudience = Configuration["FirebaseOptions:Audience"],
                        ValidateLifetime = true
                    };
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
