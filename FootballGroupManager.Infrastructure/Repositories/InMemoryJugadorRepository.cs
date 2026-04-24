using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Infrastructure.Repositories
{
    public class InMemoryJugadorRepository : IJugadorRepository
    {
        private readonly List<Jugador> _jugadores = new();
        private int _idActual = 1;

        public Task<IEnumerable<Jugador>> ObtenerTodosAsync()
            => Task.FromResult<IEnumerable<Jugador>>(_jugadores);

        public Task<Jugador?> ObtenerPorIdAsync(int id)
            => Task.FromResult(_jugadores.FirstOrDefault(j => j.Id == id));

        public Task AgregarAsync(Jugador jugador)
        {
            jugador.AsignarId(_idActual++);
            _jugadores.Add(jugador);
            return Task.CompletedTask;
        }

        public Task ActualizarAsync(Jugador jugador)
        {
            var indice = _jugadores.FindIndex(j => j.Id == jugador.Id);
            if (indice >= 0)
                _jugadores[indice] = jugador;
            return Task.CompletedTask;
        }

        public Task EliminarAsync(int id)
        {
            var jugador = _jugadores.FirstOrDefault(j => j.Id == id);
            if (jugador is not null)
                _jugadores.Remove(jugador);
            return Task.CompletedTask;
        }
    }
}