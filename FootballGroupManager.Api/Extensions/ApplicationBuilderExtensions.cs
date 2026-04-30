using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Infrastructure.Data;
using FootballGroupManager.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FootballGroupManager.Api.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection")
                                   ?? configuration["ConnectionStrings:DefaultConnection"]
                                   ?? throw new InvalidOperationException("Cadena de conexión 'DefaultConnection' no encontrada.");

            services.AddDbContext<FootballDbContext>(options =>
                options.UseSqlServer(connectionString));

            services.AddScoped<IGrupoRepository, GrupoRepository>();
            services.AddScoped<IUsuarioRepository, UsuarioRepository>();
            services.AddScoped<IPartidoRepository, PartidoRepository>();

            return services;
        }
    }
}