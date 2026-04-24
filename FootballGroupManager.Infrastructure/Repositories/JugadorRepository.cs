using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Domain.Entities;
using FootballGroupManager.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FootballGroupManager.Infrastructure.Repositories
{
    public class JugadorRepository : IJugadorRepository
    {
        private readonly FootballDbContext _context;

        public JugadorRepository(FootballDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Jugador>> ObtenerTodosAsync()
        {
            return await _context.Jugadores
                .Include(j => j.Stats)
                .ToListAsync();
        }

        public async Task<Jugador?> ObtenerPorIdAsync(int id)
        {
            return await _context.Jugadores
                .Include(j => j.Stats)
                .FirstOrDefaultAsync(j => j.Id == id);
        }

        public async Task AgregarAsync(Jugador jugador)
        {
            await _context.Jugadores.AddAsync(jugador);
            await _context.SaveChangesAsync();
        }

        public async Task ActualizarAsync(Jugador jugador)
        {
            _context.Jugadores.Update(jugador);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarAsync(int id)
        {
            var jugador = await _context.Jugadores.FindAsync(id);
            if (jugador is not null)
            {
                _context.Jugadores.Remove(jugador);
                await _context.SaveChangesAsync();
            }
        }
    }
}