namespace FootballGroupManager.Application.DTOs
{
    public class CreateJugadorDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Posicion { get; set; } = string.Empty;

        // Mismo formato que UpdateJugadorDto — consistencia en toda la API
        public Dictionary<string, int> Stats { get; set; } = new();
    }
}