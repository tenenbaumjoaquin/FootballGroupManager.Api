using FootballGroupManager.Application.DTOs.Usuario;

namespace FootballGroupManager.Application.DTOs.Partido
{
    public class PartidoDto
    {
        public int Id { get; set; }
        public int GrupoId { get; set; }
        public string Estado { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public DateTime? FechaJugado { get; set; }
        public DateTime? FechaHora { get; set; }
        public string? Direccion { get; set; }
        public double? Latitud { get; set; }
        public double? Longitud { get; set; }
        public List<PartidoJugadorDto> Jugadores { get; set; } = new();
    }
}