using FootballGroupManager.Domain.Entities;
using FootballGroupManager.Application.Interfaces;

namespace FootballGroupManager.Infrastructure.Repositories;

public class InMemoryJugadorRepository : IJugadorRepository
{
    private readonly List<Jugador> _jugadores = new();

    public IEnumerable<Jugador> ObtenerTodos()
        => _jugadores;

    public Jugador? ObtenerPorId(int id)
        => _jugadores.FirstOrDefault(j => j.Id == id);

    public void Agregar(Jugador jugador)
        => _jugadores.Add(jugador);
}