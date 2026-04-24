using FootballGroupManager.Domain.Entities;
using FootballGroupManager.Application.DTOs;
using FootballGroupManager.Application.Interfaces;

namespace FootballGroupManager.Application.Services.Jugadores;

public class JugadorService : IJugadorService
{
    private readonly List<Jugador> _jugadores = new();
    private int _idActual = 1;

    // ===== METODOS PUBLICOS =====

    public IEnumerable<JugadorDto> ObtenerTodos()
        => _jugadores.Select(MapToDto);

    public JugadorDto? ObtenerPorId(int id)
    {
        var jugador = _jugadores.FirstOrDefault(j => j.Id == id);
        return jugador == null ? null : MapToDto(jugador);
    }

    public JugadorDto Crear(CreateJugadorDto dto)
    {
        var jugador = new Jugador(
            _idActual++,
            dto.Nombre,
            dto.Posicion
        );

        jugador.CargarStats(new Dictionary<string, int>
    {
        { "VEL", dto.VEL },
        { "AGT", dto.AGT },
        { "PAS", dto.PAS },
        { "GMB", dto.GMB },
        { "DEF", dto.DEF },
        { "FIS", dto.FIS },
        { "PEG", dto.PEG },
        { "TIR", dto.TIR },
        { "ATJ", dto.ATJ },
        { "REF", dto.REF }
    });

        _jugadores.Add(jugador);

        return MapToDto(jugador);
    }


    private static JugadorDto MapToDto(Jugador jugador)
    {
        return new JugadorDto
        {
            Id = jugador.Id,
            Nombre = jugador.Nombre,
            Posicion = jugador.Posicion,
            PuntajeTotal = jugador.PuntajeTotal,
            Calificacion = jugador.Calificacion,
            Stats = jugador.Stats
                .Select(s => new StatDto
                {
                    Nombre = s.Nombre,
                    Puntuacion = s.Puntuacion
                })
                .ToList()
        };
    }
}