// PartidoJugadorDto.cs
using FootballGroupManager.Application.DTOs.Usuario;

namespace FootballGroupManager.Application.DTOs.Partido
{
    public class PartidoJugadorDto
    {
        public UsuarioDto Usuario { get; set; } = null!;
        public string? EquipoAsignado { get; set; }
        public DateTime FechaConfirmacion { get; set; }
    }
}