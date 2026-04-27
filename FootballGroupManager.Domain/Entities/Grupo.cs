using FootballGroupManager.Domain.DomainExceptions;

namespace FootballGroupManager.Domain.Entities
{
    public class Grupo
    {
        public int Id { get; private set; }
        public string Nombre { get; private set; }
        public string Codigo { get; private set; } // Código único para unirse al grupo
        public int CreadorId { get; private set; }
        public Usuario Creador { get; private set; } = null!;
        public DateTime FechaCreacion { get; private set; }

        private readonly List<GrupoUsuario> _miembros = new();
        public IReadOnlyList<GrupoUsuario> Miembros => _miembros;

        private readonly List<Partido> _partidos = new();
        public IReadOnlyList<Partido> Partidos => _partidos;

        private const int MaximoMiembros = 20; // Máximo de jugadores en el grupo

        // Constructor privado para EF Core
        private Grupo()
        {
            Nombre = string.Empty;
            Codigo = string.Empty;
            Creador = null!;
        }

        public Grupo(string nombre, Usuario creador)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new DomainException("El nombre del grupo no puede estar vacío.");

            if (creador is null)
                throw new DomainException("El grupo debe tener un creador.");

            if (creador.GruposCreados.Count >= 4)
                throw new DomainException("Un usuario no puede crear más de 4 grupos.");

            Nombre = nombre;
            CreadorId = creador.Id;
            Creador = creador;
            FechaCreacion = DateTime.UtcNow;
            Codigo = GenerarCodigo();
        }

        public void AgregarMiembro(Usuario usuario)
        {
            if (usuario is null)
                throw new DomainException("El usuario no puede ser nulo.");

            if (_miembros.Count >= MaximoMiembros)
                throw new DomainException($"El grupo ya alcanzó el máximo de {MaximoMiembros} miembros.");

            if (_miembros.Any(m => m.UsuarioId == usuario.Id))
                throw new DomainException($"{usuario.NombreUsuario} ya es miembro de este grupo.");

            if (CreadorId == usuario.Id)
                throw new DomainException("El creador del grupo ya es miembro automáticamente.");

            _miembros.Add(new GrupoUsuario(usuario, this));
        }

        public void EliminarMiembro(int usuarioId)
        {
            if (usuarioId == CreadorId)
                throw new DomainException("No se puede eliminar al creador del grupo.");

            var miembro = _miembros.FirstOrDefault(m => m.UsuarioId == usuarioId)
                ?? throw new DomainException("El usuario no es miembro de este grupo.");

            _miembros.Remove(miembro);
        }

        public void ActualizarNombre(string nombre)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new DomainException("El nombre del grupo no puede estar vacío.");

            Nombre = nombre;
        }

        public void AsignarId(int id)
        {
            if (Id != 0)
                throw new DomainException("El ID ya fue asignado.");
            if (id <= 0)
                throw new DomainException("El ID debe ser mayor a cero.");
            Id = id;
        }

        // Genera un código alfanumérico único de 6 caracteres para unirse al grupo
        private static string GenerarCodigo()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            return new string(Enumerable.Range(0, 6)
                .Select(_ => chars[random.Next(chars.Length)])
                .ToArray());
        }
    }
}