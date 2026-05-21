// UsuarioDto.cs
namespace FootballGroupManager.Application.DTOs.Usuario
{
    public class UsuarioDto
    {
        public int Id { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Posicion { get; set; } = string.Empty;
        public string Calificacion { get; set; } = string.Empty;
        public double PuntajeTotal { get; set; }
        public AvatarConfigDto? Avatar { get; set; }
        public List<StatDto> Stats { get; set; } = new();
    }
}