// IGrupoService.cs
using FootballGroupManager.Application.DTOs.Grupo;

namespace FootballGroupManager.Application.Interfaces
{
    public interface IGrupoService
    {
        Task<IEnumerable<GrupoDto>> ObtenerPorUsuarioAsync(int usuarioId);
        Task<GrupoDto?> ObtenerPorIdAsync(int id);
        Task<GrupoDto> CrearAsync(int usuarioId, CreateGrupoDto dto);
        Task<GrupoDto> UnirseAsync(int usuarioId, string codigo);
        Task AbandonarAsync(int usuarioId, int grupoId);
        Task EliminarAsync(int usuarioId, int grupoId);
    }
}