using FootballGroupManager.Domain.ValueObjects;

namespace FootballGroupManager.Domain.Services
{
    public static class CalificacionService
    {
        public static (string Calificacion, double PuntajeTotal) Calcular(
            string posicion, EstadisticasJugador stats)
        {
            double[] pesos = posicion switch
            {
                "ARQ" => new[] { 0.8, 0.8, 1.2, 1.0, 1.2, 1.2, 1.0, 1.0, 1.5, 1.5 },
                "DEF" => new[] { 1.2, 1.0, 1.2, 0.8, 1.5, 1.5, 0.8, 1.0, 1.0, 1.2 },
                "VOL" => new[] { 1.2, 1.0, 1.5, 1.5, 1.2, 0.8, 1.2, 1.0, 0.8, 1.0 },
                "DEL" => new[] { 1.2, 1.0, 1.0, 1.2, 0.8, 1.2, 1.5, 1.5, 0.8, 1.0 },
                _ => Enumerable.Repeat(1.0, 10).ToArray()
            };

            double[] valores =
            {
                stats.Velocidad, stats.Aguante, stats.Pase,   stats.Gambeta,
                stats.Defensa,   stats.Fisico,  stats.Pegada, stats.Tiro,
                stats.Atajada,   stats.Reflejo
            };

            double total = 0, totalPesos = 0;
            for (int i = 0; i < valores.Length; i++)
            {
                total += valores[i] * pesos[i];
                totalPesos += pesos[i];
            }

            double promedio = total / totalPesos;
            double puntajeTotal = Math.Round(promedio, 2);
            string calificacion = promedio switch
            {
                >= 9 => "S",
                >= 8 => "A",
                >= 7 => "B",
                >= 6 => "C",
                >= 5 => "D",
                _ => "F"
            };

            return (calificacion, puntajeTotal);
        }
    }
}