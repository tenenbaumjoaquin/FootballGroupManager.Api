using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Interfaces
{
    public interface IJugadorRepository
    {
        Task<Jugador?> ObtenerPorIdAsync(int id);
        Task<IEnumerable<Jugador>> ObtenerTodosAsync();
        Task AgregarAsync(Jugador jugador);
        Task ActualizarAsync(Jugador jugador);
        Task EliminarAsync(int id);
    }
}