using FootballGroupManager.Domain.DomainExceptions;
using FootballGroupManager.Domain.Services;
using FootballGroupManager.Domain.ValueObjects;

namespace FootballGroupManager.Domain.Entities
{
    public class Usuario
    {
        public int Id { get; private set; }
        public string NombreUsuario { get; private set; }
        public string Email { get; private set; }
        public string PasswordHash { get; private set; }

        // Perfil de jugador
        public string Nombre { get; private set; }
        public string Posicion { get; private set; }
        public string Calificacion { get; private set; } = "F";
        public double PuntajeTotal { get; private set; } = 0;
        public EstadisticasJugador? Stats { get; private set; }
        public AvatarConfig Avatar { get; private set; } = new();

        // Grupos que creó (máximo 4)
        private readonly List<Grupo> _gruposCreados = new();
        public IReadOnlyList<Grupo> GruposCreados => _gruposCreados;

        // Grupos a los que pertenece
        private readonly List<GrupoUsuario> _membresias = new();
        public IReadOnlyList<GrupoUsuario> Membresias => _membresias;

        private static readonly string[] PositicionesValidas = { "ARQ", "DEF", "VOL", "DEL" };

        // Constructor privado para EF Core
        private Usuario()
        {
            NombreUsuario = string.Empty;
            Email = string.Empty;
            PasswordHash = string.Empty;
            Nombre = string.Empty;
            Posicion = string.Empty;
        }

        public Usuario(string nombreUsuario, string email, string passwordHash,
                       string nombre, string posicion, EstadisticasJugador stats, AvatarConfig avatar)
        {
            if (string.IsNullOrWhiteSpace(nombreUsuario))
                throw new DomainException("El nombre de usuario no puede estar vacío.");

            if (string.IsNullOrWhiteSpace(email) || !email.Contains('@'))
                throw new DomainException("El email no es válido.");

            if (string.IsNullOrWhiteSpace(passwordHash))
                throw new DomainException("La contraseña no puede estar vacía.");

            if (string.IsNullOrWhiteSpace(nombre))
                throw new DomainException("El nombre del jugador no puede estar vacío.");

            if (!PositicionesValidas.Contains(posicion))
                throw new DomainException($"Posición inválida: '{posicion}'. Valores válidos: ARQ, DEF, VOL, DEL.");

            if (avatar is null)
                throw new DomainException("El avatar es obligatorio.");
            if (stats is null)
                throw new DomainException("Las estadísticas son obligatorias.");

            NombreUsuario = nombreUsuario;
            Email = email;
            PasswordHash = passwordHash;
            Nombre = nombre;
            Posicion = posicion;
            Stats = stats;
            Avatar = avatar;
            CalcularCalificacion();
        }

        public void ActualizarPerfil(string nombre, string posicion, EstadisticasJugador stats)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new DomainException("El nombre no puede estar vacío.");

            if (!PositicionesValidas.Contains(posicion))
                throw new DomainException($"Posición inválida: '{posicion}'.");

            if (stats is null)
                throw new DomainException("Las estadísticas son obligatorias.");

            Nombre = nombre;
            Posicion = posicion;
            Stats = stats;
            CalcularCalificacion();
        }
        public void ActualizarAvatar(AvatarConfig avatar)
        {
            if (avatar is null)
                throw new DomainException("La configuración del avatar no puede ser nula.");
            Avatar = avatar;
        }

        public void AsignarId(int id)
        {
            if (Id != 0)
                throw new DomainException("El ID ya fue asignado.");
            if (id <= 0)
                throw new DomainException("El ID debe ser mayor a cero.");
            Id = id;
        }

        private void CalcularCalificacion()
        {
            if (Stats is null) return;
            (Calificacion, PuntajeTotal) = CalificacionService.Calcular(Posicion, Stats);
        }
    }
}