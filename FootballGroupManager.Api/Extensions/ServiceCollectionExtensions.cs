// Extensions/ServiceCollectionExtensions.cs
using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Application.Services.Jugadores;

namespace FootballGroupManager.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services)
        {
            services.AddScoped<IJugadorService, JugadorService>();
            return services;
        }
    }
}