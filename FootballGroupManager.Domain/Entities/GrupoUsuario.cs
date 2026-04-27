using FootballGroupManager.Domain.DomainExceptions;

namespace FootballGroupManager.Domain.Entities
{
    public class GrupoUsuario
    {
        public int GrupoId { get; private set; }
        public Grupo Grupo { get; private set; } = null!;
        public int UsuarioId { get; private set; }
        public Usuario Usuario { get; private set; } = null!;
        public DateTime FechaIngreso { get; private set; }
        public bool EsCapitan { get; private set; }

        // Constructor privado para EF Core
        private GrupoUsuario()
        {
            Grupo = null!;
            Usuario = null!;
        }

        public GrupoUsuario(Usuario usuario, Grupo grupo)
        {
            if (usuario is null)
                throw new DomainException("El usuario no puede ser nulo.");

            if (grupo is null)
                throw new DomainException("El grupo no puede ser nulo.");

            UsuarioId = usuario.Id;
            Usuario = usuario;
            GrupoId = grupo.Id;
            Grupo = grupo;
            FechaIngreso = DateTime.UtcNow;
            EsCapitan = false;
        }

        public void AsignarCapitan()
        {
            EsCapitan = true;
        }

        public void QuitarCapitan()
        {
            EsCapitan = false;
        }
    }
}