using FootballGroupManager.Domain.DomainExceptions;

namespace FootballGroupManager.Domain.Entities
{
    public class Jugador
    {
        private readonly (string Nombre, int Puntuacion)[] _stats =
        {
            ("VEL", 0), ("AGT", 0), ("PAS", 0), ("GMB", 0), ("DEF", 0),
            ("FIS", 0), ("PEG", 0), ("TIR", 0), ("ATJ", 0), ("REF", 0)
        };

        public int Id { get; private set; }
        public string Nombre { get; private set; }
        public string Posicion { get; private set; }
        public string Calificacion { get; private set; } = "F";
        public double PuntajeTotal { get; private set; } = 0;
        public bool StatsInicializadas { get; private set; } = false;

        public IReadOnlyList<(string Nombre, int Puntuacion)> Stats => _stats;

        public Jugador(int id, string nombre, string posicion)
        {
            if (string.IsNullOrWhiteSpace(nombre))
                throw new DomainException("El nombre del jugador no puede estar vacío.");

            var posicionesValidas = new[] { "ARQ", "DEF", "VOL", "DEL" };
            if (!posicionesValidas.Contains(posicion))
                throw new DomainException($"Posición inválida: {posicion}. Valores válidos: ARQ, DEF, VOL, DEL.");

            Id = id;
            Nombre = nombre;
            Posicion = posicion;
        }

        public void CargarStats(Dictionary<string, int> stats)
        {
            for (int i = 0; i < _stats.Length; i++)
            {
                string nombreStat = _stats[i].Nombre;
                if (stats.TryGetValue(nombreStat, out int valor))
                {
                    if (valor < 0 || valor > 10)
                        throw new DomainException($"Valor inválido para {nombreStat}: debe estar entre 0 y 10.");
                    _stats[i] = (nombreStat, valor);
                }
            }
            CalcularCalificacion();
            StatsInicializadas = true;
        }

        public void ActualizarStat(int indice, int nuevaPuntuacion)
        {
            if (indice < 0 || indice >= _stats.Length)
                throw new DomainException($"Índice inválido: {indice}. Debe estar entre 0 y {_stats.Length - 1}.");
            if (nuevaPuntuacion < 0 || nuevaPuntuacion > 10)
                throw new DomainException("La puntuación debe estar entre 0 y 10.");

            _stats[indice] = (_stats[indice].Nombre, nuevaPuntuacion);
            CalcularCalificacion();
        }

        private void CalcularCalificacion()
        {
            double[] pesos = Posicion switch
            {
                "ARQ" => new[] { 0.8, 0.8, 1.2, 1.0, 1.2, 1.2, 1.0, 1.0, 1.5, 1.5 },
                "DEF" => new[] { 1.2, 1.0, 1.2, 0.8, 1.5, 1.5, 0.8, 1.0, 1.0, 1.2 },
                "VOL" => new[] { 1.2, 1.0, 1.5, 1.5, 1.2, 0.8, 1.2, 1.0, 0.8, 1.0 },
                "DEL" => new[] { 1.2, 1.0, 1.0, 1.2, 0.8, 1.2, 1.5, 1.5, 0.8, 1.0 },
                _ => Enumerable.Repeat(1.0, 10).ToArray()
            };

            double total = 0, totalPesos = 0;
            for (int i = 0; i < _stats.Length; i++)
            {
                total += _stats[i].Puntuacion * pesos[i];
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