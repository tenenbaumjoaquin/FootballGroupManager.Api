namespace FootballGroupManager.Application.DTOs;

public class JugadorDto
{
    public int Id { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Posicion { get; set; } = string.Empty;

    public double PuntajeTotal { get; set; }

    public string Calificacion { get; set; } = string.Empty;
}