using FootballGroupManager.Domain.DomainExceptions;
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
                       string nombre, string posicion, EstadisticasJugador stats)
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

            if (stats is null)
                throw new DomainException("Las estadísticas son obligatorias.");

            NombreUsuario = nombreUsuario;
            Email = email;
            PasswordHash = passwordHash;
            Nombre = nombre;
            Posicion = posicion;
            Stats = stats;
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

            double[] pesos = Posicion switch
            {
                "ARQ" => new[] { 0.8, 0.8, 1.2, 1.0, 1.2, 1.2, 1.0, 1.0, 1.5, 1.5 },
                "DEF" => new[] { 1.2, 1.0, 1.2, 0.8, 1.5, 1.5, 0.8, 1.0, 1.0, 1.2 },
                "VOL" => new[] { 1.2, 1.0, 1.5, 1.5, 1.2, 0.8, 1.2, 1.0, 0.8, 1.0 },
                "DEL" => new[] { 1.2, 1.0, 1.0, 1.2, 0.8, 1.2, 1.5, 1.5, 0.8, 1.0 },
                _ => Enumerable.Repeat(1.0, 10).ToArray()
            };

            double[] valores =
            {
                Stats.Velocidad, Stats.Aguante, Stats.Pase,    Stats.Gambeta,
                Stats.Defensa,   Stats.Fisico,  Stats.Pegada,  Stats.Tiro,
                Stats.Atajada,   Stats.Reflejo
            };

            double total = 0, totalPesos = 0;
            for (int i = 0; i < valores.Length; i++)
            {
                total += valores[i] * pesos[i];
                totalPesos += pesos[i];
            }

            double promedio = total / totalPesos;
            PuntajeTotal = Math.Round(promedio, 2);
            Calificacion = promedio switch
            {
                >= 9 => "S",
                >= 8 => "A",
                >= 7 => "B",
                >= 6 => "C",
                >= 5 => "D",
                _ => "F"
            };
        }
    }
}