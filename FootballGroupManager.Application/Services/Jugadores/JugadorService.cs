using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Services.Jugadores;

public class JugadorService
{
    private readonly List<Jugador> _jugadores = new();
    private int _idActual = 1;

    public Jugador CrearJugador(
        string nombre,
        string posicion,
        Dictionary<string, int> stats)
    {
        var jugador = new Jugador(
            _idActual++,
            nombre,
            posicion
        );

        jugador.CargarStats(stats);

        _jugadores.Add(jugador);

        return jugador;
    }

    public List<Jugador> ObtenerTodos()
        => _jugadores;
}