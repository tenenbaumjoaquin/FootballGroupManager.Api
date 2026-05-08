using FluentValidation;
using FluentValidation.AspNetCore;
using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Application.Services.Auth;
using FootballGroupManager.Application.Services.Grupos;
using FootballGroupManager.Application.Services.Partidos;
using FootballGroupManager.Application.Services.Usuarios;
using FootballGroupManager.Application.Validators;

namespace FootballGroupManager.Api.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddApplicationServices(
            this IServiceCollection services)
        {
            // Servicios
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IGrupoService, GrupoService>();
            services.AddScoped<IPartidoService, PartidoService>();
            services.AddScoped<IAuthService, AuthService>();

            // FluentValidation
            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<LoginDtoValidator>();

            return services;
        }
    }
}