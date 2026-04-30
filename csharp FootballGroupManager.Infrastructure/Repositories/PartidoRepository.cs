using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Domain.Entities;
using FootballGroupManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FootballGroupManager.Infrastructure.Repositories
{
    public class PartidoRepository : IPartidoRepository
    {
        private readonly FootballDbContext _context;

        public PartidoRepository(FootballDbContext context)
        {
            _context = context;
        }

        public async Task<Partido?> ObtenerPorIdAsync(int id)
        {
            return await _context.Partidos
                .Include(p => p.Jugadores)
                    .ThenInclude(pj => pj.Usuario)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Partido?> ObtenerActivoPorGrupoAsync(int grupoId)
        {
            return await _context.Partidos
                .Include(p => p.Jugadores)
                    .ThenInclude(pj => pj.Usuario)
                .Where(p => p.GrupoId == grupoId &&
                            (p.Estado == Domain.Enums.EstadoPartido.Abierto ||
                             p.Estado == Domain.Enums.EstadoPartido.Cerrado))
                .OrderByDescending(p => p.FechaCreacion)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<Partido>> ObtenerHistorialPorGrupoAsync(int grupoId)
        {
            return await _context.Partidos
                .Include(p => p.Jugadores)
                    .ThenInclude(pj => pj.Usuario)
                .Where(p => p.GrupoId == grupoId)
                .OrderByDescending(p => p.FechaCreacion)
                .ToListAsync();
        }

        public async Task AgregarAsync(Partido partido)
        {
            await _context.Partidos.AddAsync(partido);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Partido partido)
        {
            _context.Partidos.Update(partido);
            await _context.SaveChangesAsync();
        }
    }
}