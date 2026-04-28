using FootballGroupManager.Application.DTOs.Grupo;
using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Mappings
{
    public static class GrupoMapper
    {
        public static GrupoDto ToDto(Grupo grupo)
        {
            return new GrupoDto
            {
                Id = grupo.Id,
                Nombre = grupo.Nombre,
                Codigo = grupo.Codigo,
                FechaCreacion = grupo.FechaCreacion,
                Creador = UsuarioMapper.ToDto(grupo.Creador),
                Miembros = grupo.Miembros
                    .Select(m => UsuarioMapper.ToDto(m.Usuario))
                    .ToList()
            };
        }
    }
}