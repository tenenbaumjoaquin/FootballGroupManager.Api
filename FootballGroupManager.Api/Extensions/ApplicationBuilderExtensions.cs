using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Infrastructure.Repositories;

namespace FootballGroupManager.Api.Extensions
{
    public static class ApplicationBuilderExtensions
    {
        public static IServiceCollection AddInfrastructureServices(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            services.AddScoped<IJugadorRepository, InMemoryJugadorRepository>();
            // Cuando tengas EF Core listo, reemplazás esta línea por:
            // services.AddDbContext<FootballDbContext>(options =>
            //     options.UseSqlServer(configuration.GetConnectionString("Default")));
            // services.AddScoped<IJugadorRepository, JugadorRepository>();
            return services;
        }
    }
}