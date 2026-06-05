namespace FootballGroupManager.Application.DTOs.Partido
{
    public class MiembroEstadoDto
    {
        public int UsuarioId { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public string Nombre { get; set; } = string.Empty;
        public string Posicion { get; set; } = string.Empty;
        public string Calificacion { get; set; } = string.Empty;
        public double PuntajeTotal { get; set; }
        public bool Confirmado { get; set; }
    }
}