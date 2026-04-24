namespace FootballGroupManager.Application.DTOs
{
    public class UpdateJugadorDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Posicion { get; set; } = string.Empty;
        public Dictionary<string, int>? Stats { get; set; }
    }
}