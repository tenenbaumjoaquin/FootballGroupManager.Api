using FootballGroupManager.Domain.DomainExceptions;
using FootballGroupManager.Domain.ValueObjects;

namespace FootballGroupManager.Domain.Entities
{
    public class Jugador
    {
        public int Id { get; private set; }
        public string Nombre { get; private set; }
        public string Posicion { get; private set; }
        public string Calificacion { get; private set; } = "F";
        public double PuntajeTotal { get; private set; } = 0;
        public EstadisticasJugador? Stats { get; private set; }

        private static readonly string[] PositicionesValidas = { "ARQ", "DEF", "VOL", "DEL" };

        public Jugador(int id, string nombre, string posicion, EstadisticasJugador stats)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new DomainException("El nombre del jugador no puede estar vacío.");

            if (!PositicionesValidas.Contains(posicion))
                throw new DomainException($"Posición inválida: '{posicion}'. Valores válidos: ARQ, DEF, VOL, DEL.");

            if (stats is null)
                throw new DomainException("Las estadísticas son obligatorias al crear un jugador.");

            Id = id;
            Nombre = nombre;
            Posicion = posicion;
            Stats = stats;
            CalcularCalificacion();
        }
        // Agregar en Jugador.cs
        public void AsignarId(int id)
        {
            if (Id != 0)
                throw new DomainException("El ID ya fue asignado.");
            if (id <= 0)
                throw new DomainException("El ID debe ser mayor a cero.");
            Id = id;
        }
        public void ActualizarNombre(string nombre)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new DomainException("El nombre no puede estar vacío.");
            Nombre = nombre;
        }

        public void ActualizarPosicion(string posicion)
        {
            if (!PositicionesValidas.Contains(posicion))
                throw new DomainException($"Posición inválida: '{posicion}'.");
            Posicion = posicion;
            CalcularCalificacion(); // los pesos cambian con la posición
        }

        public void CargarStats(EstadisticasJugador stats)
        {
            Stats = stats ?? throw new DomainException("Las estadísticas no pueden ser nulas.");
            CalcularCalificacion();
        }

        public void ActualizarStat(string nombreCorto, int nuevaPuntuacion)
        {
            if (Stats is null)
                throw new DomainException("Las stats no fueron inicializadas. Llamá a CargarStats primero.");

            Stats = Stats.ConStat(nombreCorto, nuevaPuntuacion);
            CalcularCalificacion();
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

            // El orden debe coincidir con el constructor de EstadisticasJugador:
            // VEL, AGT, PAS, GMB, DEF, FIS, PEG, TIR, ATJ, REF
            double[] valores =
            {
                Stats.Velocidad,
                Stats.Aguante,
                Stats.Pase,
                Stats.Gambeta,
                Stats.Defensa,
                Stats.Fisico,
                Stats.Pegada,
                Stats.Tiro,
                Stats.Atajada,
                Stats.Reflejo
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