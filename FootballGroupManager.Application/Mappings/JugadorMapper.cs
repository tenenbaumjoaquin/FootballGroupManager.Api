using FootballGroupManager.Application.DTOs;
using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Mapping;

public static class JugadorMapper
{
    public static JugadorDto ToDto(Jugador jugador)
    {
        return new JugadorDto
        {
            Id = jugador.Id,
            Nombre = jugador.Nombre,
            Posicion = jugador.Posicion,
            PuntajeTotal = jugador.PuntajeTotal,
            Calificacion = jugador.Calificacion
        };
    }
}