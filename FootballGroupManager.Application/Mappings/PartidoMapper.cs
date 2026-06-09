using FootballGroupManager.Application.DTOs.Partido;
using FootballGroupManager.Application.DTOs.Usuario;
using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Mappings
{
    public static class PartidoMapper
    {
        public static PartidoDto ToDto(Partido partido)
        {
            var jugadoresConfirmados = partido.Jugadores
                .Select(pj => pj.UsuarioId)
                .ToHashSet();

            var miembros = partido.Grupo.Miembros
                .Select(m => m.Usuario)
                .ToList();

            // Agregar el creador si no está en miembros
            if (!miembros.Any(m => m.Id == partido.Grupo.CreadorId))
                miembros.Add(partido.Grupo.Creador);

            return new PartidoDto
            {
                Id = partido.Id,
                GrupoId = partido.GrupoId,
                Estado = partido.Estado.ToString(),
                FechaCreacion = partido.FechaCreacion,
                FechaJugado = partido.FechaJugado,
                FechaHora = partido.FechaHora,
                Direccion = partido.Direccion,
                Latitud = partido.Latitud,
                Longitud = partido.Longitud,
                Jugadores = partido.Jugadores
                    .Select(pj => new PartidoJugadorDto
                    {
                        Usuario = UsuarioMapper.ToDto(pj.Usuario),
                        EquipoAsignado = pj.EquipoAsignado?.ToString(),
                        FechaConfirmacion = pj.FechaConfirmacion
                    })
                    .ToList(),
                Miembros = miembros
                    .Select(u => new MiembroEstadoDto
                    {
                        UsuarioId = u.Id,
                        NombreUsuario = u.NombreUsuario,
                        Nombre = u.Nombre,
                        Posicion = u.Posicion,
                        Calificacion = u.Calificacion,
                        PuntajeTotal = u.PuntajeTotal,
                        Confirmado = jugadoresConfirmados.Contains(u.Id),
                        Avatar = u.Avatar is null ? null : new AvatarConfigDto
                        {
                            Cara = u.Avatar.Cara,
                            ColorPiel = u.Avatar.ColorPiel,
                            Boca = u.Avatar.Boca,
                            Nariz = u.Avatar.Nariz,
                            Ojos = u.Avatar.Ojos,
                            ColorOjos = u.Avatar.ColorOjos,
                            Pelo = u.Avatar.Pelo,
                            ColorPelo = u.Avatar.ColorPelo,
                            Barba = u.Avatar.Barba,
                            ColorBarba = u.Avatar.ColorBarba,
                            Accesorio = u.Avatar.Accesorio,
                            Camiseta = u.Avatar.Camiseta,
                            ColorCamisetaPrincipal = u.Avatar.ColorCamisetaPrincipal,
                            ColorCamisetaSecundario = u.Avatar.ColorCamisetaSecundario,
                            Fondo = u.Avatar.Fondo,
                        },
                        Stats = u.Stats is null ? new() : new List<StatDto>
                        {
                            new() { Nombre = "VEL", Puntuacion = u.Stats.Velocidad },
                            new() { Nombre = "AGT", Puntuacion = u.Stats.Aguante  },
                            new() { Nombre = "PAS", Puntuacion = u.Stats.Pase     },
                            new() { Nombre = "GMB", Puntuacion = u.Stats.Gambeta  },
                            new() { Nombre = "DEF", Puntuacion = u.Stats.Defensa  },
                            new() { Nombre = "FIS", Puntuacion = u.Stats.Fisico   },
                            new() { Nombre = "PEG", Puntuacion = u.Stats.Pegada   },
                            new() { Nombre = "TIR", Puntuacion = u.Stats.Tiro     },
                            new() { Nombre = "ATJ", Puntuacion = u.Stats.Atajada  },
                            new() { Nombre = "REF", Puntuacion = u.Stats.Reflejo  },
                        }
                    })
                    .ToList()
            };
        }
    }
}