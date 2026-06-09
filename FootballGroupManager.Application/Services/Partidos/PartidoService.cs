using FootballGroupManager.Application.DTOs.Partido;
using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Application.Mappings;
using FootballGroupManager.Domain.DomainExceptions;
using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Services.Partidos
{
    public class PartidoService : IPartidoService
    {
        private readonly IPartidoRepository _partidoRepositorio;
        private readonly IGrupoRepository _grupoRepositorio;
        private readonly IUsuarioRepository _usuarioRepositorio;

        public PartidoService(
            IPartidoRepository partidoRepositorio,
            IGrupoRepository grupoRepositorio,
            IUsuarioRepository usuarioRepositorio)
        {
            _partidoRepositorio = partidoRepositorio;
            _grupoRepositorio = grupoRepositorio;
            _usuarioRepositorio = usuarioRepositorio;
        }

        public async Task<PartidoDto?> ObtenerActivoPorGrupoAsync(int grupoId)
        {
            var partido = await _partidoRepositorio.ObtenerActivoPorGrupoAsync(grupoId);
            return partido is null ? null : PartidoMapper.ToDto(partido);
        }

        public async Task<IEnumerable<PartidoDto>> ObtenerHistorialPorGrupoAsync(int grupoId)
        {
            var partidos = await _partidoRepositorio.ObtenerHistorialPorGrupoAsync(grupoId);
            return partidos.Select(PartidoMapper.ToDto);
        }

        public async Task<PartidoDto> CrearAsync(int grupoId)
        {
            var grupo = await _grupoRepositorio.ObtenerPorIdAsync(grupoId)
                ?? throw new DomainException($"No se encontró un grupo con ID {grupoId}.");

            var partido = new Partido(grupo);
            await _partidoRepositorio.AgregarAsync(partido);
            return PartidoMapper.ToDto(partido);
        }

        public async Task<PartidoDto> ConfirmarAsistenciaAsync(int partidoId, int usuarioId)
        {
            var partido = await _partidoRepositorio.ObtenerPorIdAsync(partidoId)
                ?? throw new DomainException($"No se encontró un partido con ID {partidoId}.");

            var usuario = await _usuarioRepositorio.ObtenerPorIdAsync(usuarioId)
                ?? throw new DomainException($"No se encontró un usuario con ID {usuarioId}.");

            partido.ConfirmarAsistencia(usuario);
            await _partidoRepositorio.ActualizarAsync(partido);
            return PartidoMapper.ToDto(partido);
        }

        public async Task<PartidoDto> CancelarAsistenciaAsync(int partidoId, int usuarioId)
        {
            var partido = await _partidoRepositorio.ObtenerPorIdAsync(partidoId)
                ?? throw new DomainException($"No se encontró un partido con ID {partidoId}.");

            partido.CancelarAsistencia(usuarioId);
            await _partidoRepositorio.ActualizarAsync(partido);
            return PartidoMapper.ToDto(partido);
        }

        public async Task<PartidoDto> GenerarEquiposAsync(int partidoId)
        {
            var partido = await _partidoRepositorio.ObtenerPorIdAsync(partidoId)
                ?? throw new DomainException($"No se encontró un partido con ID {partidoId}.");

            partido.GenerarEquipos();
            await _partidoRepositorio.ActualizarAsync(partido);
            return PartidoMapper.ToDto(partido);
        }

        public async Task<PartidoDto> MarcarComoJugadoAsync(int partidoId)
        {
            var partido = await _partidoRepositorio.ObtenerPorIdAsync(partidoId)
                ?? throw new DomainException($"No se encontró un partido con ID {partidoId}.");

            partido.MarcarComoJugado();
            await _partidoRepositorio.ActualizarAsync(partido);
            return PartidoMapper.ToDto(partido);
        }
        public async Task<PartidoDto> SuspenderAsync(int partidoId)
        {
            var partido = await _partidoRepositorio.ObtenerPorIdAsync(partidoId)
                ?? throw new DomainException($"No se encontró un partido con ID {partidoId}.");

            partido.Suspender();
            await _partidoRepositorio.ActualizarAsync(partido);
            return PartidoMapper.ToDto(partido);
        }
        public async Task<PartidoDto> ActualizarDetallesAsync(int partidoId, ActualizarDetallesPartidoDto dto)
        {
            var partido = await _partidoRepositorio.ObtenerPorIdAsync(partidoId)
                ?? throw new DomainException($"No se encontró un partido con ID {partidoId}.");

            partido.ActualizarDetalles(dto.FechaHora, dto.Direccion, dto.Latitud, dto.Longitud);
            await _partidoRepositorio.ActualizarAsync(partido);
            return PartidoMapper.ToDto(partido);
        }
    }
}