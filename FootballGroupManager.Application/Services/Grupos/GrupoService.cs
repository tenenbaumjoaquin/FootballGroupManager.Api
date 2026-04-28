using FootballGroupManager.Application.DTOs.Grupo;
using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Application.Mappings;
using FootballGroupManager.Domain.DomainExceptions;
using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Services.Grupos
{
    public class GrupoService : IGrupoService
    {
        private readonly IGrupoRepository _grupoRepositorio;
        private readonly IUsuarioRepository _usuarioRepositorio;

        public GrupoService(IGrupoRepository grupoRepositorio, IUsuarioRepository usuarioRepositorio)
        {
            _grupoRepositorio = grupoRepositorio;
            _usuarioRepositorio = usuarioRepositorio;
        }

        public async Task<IEnumerable<GrupoDto>> ObtenerPorUsuarioAsync(int usuarioId)
        {
            var grupos = await _grupoRepositorio.ObtenerPorUsuarioAsync(usuarioId);
            return grupos.Select(GrupoMapper.ToDto);
        }

        public async Task<GrupoDto?> ObtenerPorIdAsync(int id)
        {
            var grupo = await _grupoRepositorio.ObtenerPorIdAsync(id);
            return grupo is null ? null : GrupoMapper.ToDto(grupo);
        }

        public async Task<GrupoDto> CrearAsync(int usuarioId, CreateGrupoDto dto)
        {
            var usuario = await _usuarioRepositorio.ObtenerPorIdAsync(usuarioId)
                ?? throw new DomainException($"No se encontró un usuario con ID {usuarioId}.");

            var grupo = new Grupo(dto.Nombre, usuario);
            await _grupoRepositorio.AgregarAsync(grupo);
            return GrupoMapper.ToDto(grupo);
        }

        public async Task<GrupoDto> UnirseAsync(int usuarioId, string codigo)
        {
            var usuario = await _usuarioRepositorio.ObtenerPorIdAsync(usuarioId)
                ?? throw new DomainException($"No se encontró un usuario con ID {usuarioId}.");

            var grupo = await _grupoRepositorio.ObtenerPorCodigoAsync(codigo)
                ?? throw new DomainException($"No se encontró un grupo con el código '{codigo}'.");

            grupo.AgregarMiembro(usuario);
            await _grupoRepositorio.ActualizarAsync(grupo);
            return GrupoMapper.ToDto(grupo);
        }

        public async Task AbandonarAsync(int usuarioId, int grupoId)
        {
            var grupo = await _grupoRepositorio.ObtenerPorIdAsync(grupoId)
                ?? throw new DomainException($"No se encontró un grupo con ID {grupoId}.");

            grupo.EliminarMiembro(usuarioId);
            await _grupoRepositorio.ActualizarAsync(grupo);
        }

        public async Task EliminarAsync(int usuarioId, int grupoId)
        {
            var grupo = await _grupoRepositorio.ObtenerPorIdAsync(grupoId)
                ?? throw new DomainException($"No se encontró un grupo con ID {grupoId}.");

            if (grupo.CreadorId != usuarioId)
                throw new DomainException("Solo el creador puede eliminar el grupo.");

            await _grupoRepositorio.EliminarAsync(grupoId);
        }
    }
}