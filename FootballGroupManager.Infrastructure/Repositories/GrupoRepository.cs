using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Domain.Entities;
using FootballGroupManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FootballGroupManager.Infrastructure.Repositories
{
    public class GrupoRepository : IGrupoRepository
    {
        private readonly FootballDbContext _context;

        public GrupoRepository(FootballDbContext context)
        {
            _context = context;
        }

        public async Task<Grupo?> ObtenerPorIdAsync(int id)
        {
            return await _context.Grupos
                .Include(g => g.Creador)
                .Include(g => g.Miembros)
                    .ThenInclude(m => m.Usuario)
                .FirstOrDefaultAsync(g => g.Id == id);
        }

        public async Task<Grupo?> ObtenerPorCodigoAsync(string codigo)
        {
            return await _context.Grupos
                .Include(g => g.Creador)
                .Include(g => g.Miembros)
                    .ThenInclude(m => m.Usuario)
                .FirstOrDefaultAsync(g => g.Codigo == codigo);
        }

        public async Task<IEnumerable<Grupo>> ObtenerPorUsuarioAsync(int usuarioId)
        {
            return await _context.Grupos
                .Include(g => g.Creador)
                .Include(g => g.Miembros)
                    .ThenInclude(m => m.Usuario)
                .Where(g => g.CreadorId == usuarioId ||
                            g.Miembros.Any(m => m.UsuarioId == usuarioId))
                .ToListAsync();
        }

        public async Task AgregarAsync(Grupo grupo)
        {
            await _context.Grupos.AddAsync(grupo);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Grupo grupo)
        {
            _context.Grupos.Update(grupo);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync(int id)
        {
            var grupo = await _context.Grupos.FindAsync(id);
            if (grupo is not null)
            {
                _context.Grupos.Remove(grupo);
                await _context.SaveChangesAsync();
            }
        }
    }
}