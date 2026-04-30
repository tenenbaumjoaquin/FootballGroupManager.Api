using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Application.Services.Auth;
using FootballGroupManager.Application.Services.Grupos;
using FootballGroupManager.Application.Services.Partidos;
using FootballGroupManager.Application.Services.Usuarios;

namespace FootballGroupManager.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services)
        {
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IGrupoService, GrupoService>();
            services.AddScoped<IPartidoService, PartidoService>();
            services.AddScoped<IAuthService, AuthService>();
            return services;
        }
    }
}