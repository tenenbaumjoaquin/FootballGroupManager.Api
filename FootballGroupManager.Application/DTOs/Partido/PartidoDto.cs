// PartidoDto.cs
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
        public List<PartidoJugadorDto> Jugadores { get; set; } = new();
    }
}