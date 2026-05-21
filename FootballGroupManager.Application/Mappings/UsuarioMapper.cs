using FootballGroupManager.Application.DTOs.Usuario;
using FootballGroupManager.Domain.Entities;
using FootballGroupManager.Domain.ValueObjects;

namespace FootballGroupManager.Application.Mappings
{
    public static class UsuarioMapper
    {
        public static UsuarioDto ToDto(Usuario usuario)
        {
            return new UsuarioDto
            {
                Id = usuario.Id,
                NombreUsuario = usuario.NombreUsuario,
                Email = usuario.Email,
                Nombre = usuario.Nombre,
                Posicion = usuario.Posicion,
                Calificacion = usuario.Calificacion,
                PuntajeTotal = usuario.PuntajeTotal,
                Avatar = usuario.Avatar is null ? null : new AvatarConfigDto
                {
                    Cara = usuario.Avatar.Cara,
                    ColorPiel = usuario.Avatar.ColorPiel,
                    Boca = usuario.Avatar.Boca,
                    Nariz = usuario.Avatar.Nariz,
                    Ojos = usuario.Avatar.Ojos,
                    ColorOjos = usuario.Avatar.ColorOjos,
                    Pelo = usuario.Avatar.Pelo,
                    ColorPelo = usuario.Avatar.ColorPelo,
                    Barba = usuario.Avatar.Barba,
                    ColorBarba = usuario.Avatar.ColorBarba,
                    Accesorio = usuario.Avatar.Accesorio,
                    Camiseta = usuario.Avatar.Camiseta,
                    ColorCamisetaPrincipal = usuario.Avatar.ColorCamisetaPrincipal,
                    ColorCamisetaSecundario = usuario.Avatar.ColorCamisetaSecundario,
                    Fondo = usuario.Avatar.Fondo,
                },
                Stats = usuario.Stats is null
                    ? new List<StatDto>()
                    : new List<StatDto>
                    {
                        new() { Nombre = "VEL", Puntuacion = usuario.Stats.Velocidad },
                        new() { Nombre = "AGT", Puntuacion = usuario.Stats.Aguante  },
                        new() { Nombre = "PAS", Puntuacion = usuario.Stats.Pase     },
                        new() { Nombre = "GMB", Puntuacion = usuario.Stats.Gambeta  },
                        new() { Nombre = "DEF", Puntuacion = usuario.Stats.Defensa  },
                        new() { Nombre = "FIS", Puntuacion = usuario.Stats.Fisico   },
                        new() { Nombre = "PEG", Puntuacion = usuario.Stats.Pegada   },
                        new() { Nombre = "TIR", Puntuacion = usuario.Stats.Tiro     },
                        new() { Nombre = "ATJ", Puntuacion = usuario.Stats.Atajada  },
                        new() { Nombre = "REF", Puntuacion = usuario.Stats.Reflejo  },
                    }
            };
        }

        public static EstadisticasJugador ToEstadisticas(Dictionary<string, int> stats)
        {
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