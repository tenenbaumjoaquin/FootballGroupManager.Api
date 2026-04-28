// IGrupoRepository.cs
using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Interfaces
{
    public interface IGrupoRepository
    {
        Task<Grupo?> ObtenerPorIdAsync(int id);
        Task<Grupo?> ObtenerPorCodigoAsync(string codigo);
        Task<IEnumerable<Grupo>> ObtenerPorUsuarioAsync(int usuarioId);
        Task AgregarAsync(Grupo grupo);
        Task ActualizarAsync(Grupo grupo);
        Task EliminarAsync(int id);
    }
}