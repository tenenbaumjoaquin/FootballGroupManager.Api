using FootballGroupManager.Application.DTOs.Usuario;

namespace FootballGroupManager.Application.Interfaces
{
    public interface IUsuarioService
    {
        Task<IEnumerable<UsuarioDto>> ObtenerTodosAsync();
        Task<UsuarioDto?> ObtenerPorIdAsync(int id);
        Task<UsuarioDto> CrearAsync(CreateUsuarioDto dto);
        Task<UsuarioDto> ActualizarPerfilAsync(int id, UpdateUsuarioDto dto);
        Task EliminarAsync(int id);
        Task<bool> VerificarEmailAsync(string email);
        Task CambiarPasswordAsync(string email, string nuevaPassword);
    }
}