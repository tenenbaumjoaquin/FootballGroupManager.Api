using FootballGroupManager.Application.DTOs.Partido;
using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Mappings
{
    public static class PartidoMapper
    {
        public static PartidoDto ToDto(Partido partido)
        {
            return new PartidoDto
            {
                Id = partido.Id,
                GrupoId = partido.GrupoId,
                Estado = partido.Estado.ToString(),
                FechaCreacion = partido.FechaCreacion,
                FechaJugado = partido.FechaJugado,
                Jugadores = partido.Jugadores
                    .Select(pj => new PartidoJugadorDto
                    {
                        Usuario = UsuarioMapper.ToDto(pj.Usuario),
                        EquipoAsignado = pj.EquipoAsignado?.ToString(),
                        FechaConfirmacion = pj.FechaConfirmacion
                    })
                    .ToList()
            };
        }
    }
}