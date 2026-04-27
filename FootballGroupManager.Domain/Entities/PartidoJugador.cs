using FootballGroupManager.Domain.DomainExceptions;
using FootballGroupManager.Domain.Enums;

namespace FootballGroupManager.Domain.Entities
{
    public class PartidoJugador
    {
        public int PartidoId { get; private set; }
        public Partido Partido { get; private set; } = null!;
        public int UsuarioId { get; private set; }
        public Usuario Usuario { get; private set; } = null!;
        public Equipo? EquipoAsignado { get; private set; }
        public DateTime FechaConfirmacion { get; private set; }

        // Constructor privado para EF Core
        private PartidoJugador()
        {
            Partido = null!;
            Usuario = null!;
        }

        public PartidoJugador(Usuario usuario, Partido partido)
        {
            if (usuario is null)
                throw new DomainException("El usuario no puede ser nulo.");

            if (partido is null)
                throw new DomainException("El partido no puede ser nulo.");

            UsuarioId = usuario.Id;
            Usuario = usuario;
            PartidoId = partido.Id;
            Partido = partido;
            FechaConfirmacion = DateTime.UtcNow;
        }

        public void AsignarEquipo(Equipo equipo)
        {
            if (EquipoAsignado is not null)
                throw new DomainException("El jugador ya tiene un equipo asignado.");

            EquipoAsignado = equipo;
        }
    }
}