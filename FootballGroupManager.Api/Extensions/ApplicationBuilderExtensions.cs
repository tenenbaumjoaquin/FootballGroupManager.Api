using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Infrastructure.Data;
using FootballGroupManager.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace FootballGroupManager.Api.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddDbContext<FootballDbContext>(options =>
                options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<IGrupoRepository, GrupoRepository>();

            return services;
        }
    }
}