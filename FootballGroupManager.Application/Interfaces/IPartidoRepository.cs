// IPartidoRepository.cs
using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Interfaces
{
    public interface IPartidoRepository
    {
        Task<Partido?> ObtenerPorIdAsync(int id);
        Task<Partido?> ObtenerActivoPorGrupoAsync(int grupoId);
        Task<IEnumerable<Partido>> ObtenerHistorialPorGrupoAsync(int grupoId);
        Task AgregarAsync(Partido partido);
        Task ActualizarAsync(Partido partido);
    }
}