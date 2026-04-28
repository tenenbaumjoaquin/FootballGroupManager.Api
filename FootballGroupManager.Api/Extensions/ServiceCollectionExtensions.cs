using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Application.Services.Usuarios;
using FootballGroupManager.Application.Services.Grupos;


namespace FootballGroupManager.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services)
        {
            services.AddScoped<IGrupoService, GrupoService>();
            services.AddScoped<IUsuarioService, UsuarioService>();
            return services;
        }
    }
}