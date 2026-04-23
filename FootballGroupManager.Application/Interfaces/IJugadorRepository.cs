using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Interfaces;

public interface IJugadorRepository
{
    IEnumerable<Jugador> ObtenerTodos();
    Jugador? ObtenerPorId(int id);
    void Agregar(Jugador jugador);
}