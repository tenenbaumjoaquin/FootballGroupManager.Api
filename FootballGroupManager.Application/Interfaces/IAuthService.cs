using FootballGroupManager.Application.DTOs.Auth;
using FootballGroupManager.Application.DTOs.Usuario;

namespace FootballGroupManager.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginDto dto);
        Task<AuthResponseDto> RegistrarAsync(CreateUsuarioDto dto);
    }
}