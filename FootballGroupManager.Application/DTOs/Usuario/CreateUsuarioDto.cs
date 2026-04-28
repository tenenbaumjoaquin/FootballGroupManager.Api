// CreateUsuarioDto.cs
namespace FootballGroupManager.Application.DTOs.Usuario
{
    public class CreateUsuarioDto
    {
        public string NombreUsuario { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Posicion { get; set; } = string.Empty;
        public Dictionary<string, int> Stats { get; set; } = new();
    }
}