// IPartidoService.cs
using FootballGroupManager.Application.DTOs.Partido;

namespace FootballGroupManager.Application.Interfaces
{
    public interface IPartidoService
    {
        Task<PartidoDto?> ObtenerActivoPorGrupoAsync(int grupoId);
        Task<IEnumerable<PartidoDto>> ObtenerHistorialPorGrupoAsync(int grupoId);
        Task<PartidoDto> CrearAsync(int grupoId);
        Task<PartidoDto> ConfirmarAsistenciaAsync(int partidoId, int usuarioId);
        Task<PartidoDto> CancelarAsistenciaAsync(int partidoId, int usuarioId);
        Task<PartidoDto> GenerarEquiposAsync(int partidoId);
        Task<PartidoDto> MarcarComoJugadoAsync(int partidoId);
        Task<PartidoDto> ActualizarDetallesAsync(int partidoId, ActualizarDetallesPartidoDto dto);
    }
}