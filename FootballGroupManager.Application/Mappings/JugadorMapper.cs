using FootballGroupManager.Application.DTOs;
using FootballGroupManager.Domain.Entities;
using FootballGroupManager.Domain.ValueObjects;

namespace FootballGroupManager.Application.Mapping
{
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
                Calificacion = jugador.Calificacion,
                Stats = jugador.Stats is null
                    ? new List<StatDto>()
                    : new List<StatDto>
                    {
                        new() { Nombre = "VEL", Puntuacion = jugador.Stats.Velocidad },
                        new() { Nombre = "AGT", Puntuacion = jugador.Stats.Aguante  },
                        new() { Nombre = "PAS", Puntuacion = jugador.Stats.Pase     },
                        new() { Nombre = "GMB", Puntuacion = jugador.Stats.Gambeta  },
                        new() { Nombre = "DEF", Puntuacion = jugador.Stats.Defensa  },
                        new() { Nombre = "FIS", Puntuacion = jugador.Stats.Fisico   },
                        new() { Nombre = "PEG", Puntuacion = jugador.Stats.Pegada   },
                        new() { Nombre = "TIR", Puntuacion = jugador.Stats.Tiro     },
                        new() { Nombre = "ATJ", Puntuacion = jugador.Stats.Atajada  },
                        new() { Nombre = "REF", Puntuacion = jugador.Stats.Reflejo  },
                    }
            };
        }

        public static EstadisticasJugador ToEstadisticas(Dictionary<string, int> stats)
        {
            // Valores por defecto 0 si la key no viene en el dict
            stats.TryGetValue("VEL", out int vel);
            stats.TryGetValue("AGT", out int agt);
            stats.TryGetValue("PAS", out int pas);
            stats.TryGetValue("GMB", out int gmb);
            stats.TryGetValue("DEF", out int def);
            stats.TryGetValue("FIS", out int fis);
            stats.TryGetValue("PEG", out int peg);
            stats.TryGetValue("TIR", out int tir);
            stats.TryGetValue("ATJ", out int atj);
            stats.TryGetValue("REF", out int ref_);

            return new EstadisticasJugador(vel, agt, pas, gmb, def, fis, peg, tir, atj, ref_);
        }
    }
}