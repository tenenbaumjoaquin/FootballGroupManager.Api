// GrupoDto.cs
using FootballGroupManager.Application.DTOs.Usuario;

namespace FootballGroupManager.Application.DTOs.Grupo
{
    public class GrupoDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public DateTime FechaCreacion { get; set; }
        public UsuarioDto Creador { get; set; } = null!;
        public List<UsuarioDto> Miembros { get; set; } = new();
    }
}