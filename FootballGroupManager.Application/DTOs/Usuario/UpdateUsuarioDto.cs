// UpdateUsuarioDto.cs
namespace FootballGroupManager.Application.DTOs.Usuario
{
    public class UpdateUsuarioDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Posicion { get; set; } = string.Empty;
        public Dictionary<string, int> Stats { get; set; } = new();
    }
}