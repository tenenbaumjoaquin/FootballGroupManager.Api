using FootballGroupManager.Application.DTOs.Partido;
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
                    })
                    .ToList()
            };
        }
    }
}