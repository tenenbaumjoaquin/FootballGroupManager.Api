using FootballGroupManager.Application.DTOs;

namespace FootballGroupManager.Application.Interfaces
{
    public interface IJugadorService
    {
        Task<IEnumerable<JugadorDto>> ObtenerTodosAsync();
        Task<JugadorDto?> ObtenerPorIdAsync(int id);
        Task<JugadorDto> CrearAsync(CreateJugadorDto dto);
        Task<JugadorDto> ActualizarAsync(int id, UpdateJugadorDto dto);
        Task EliminarAsync(int id);
    }
}