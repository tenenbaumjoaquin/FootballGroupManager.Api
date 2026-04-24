using FootballGroupManager.Application.DTOs;

namespace FootballGroupManager.Application.Interfaces;

public interface IJugadorService
{
    IEnumerable<JugadorDto> ObtenerTodos();

    JugadorDto? ObtenerPorId(int id);

    JugadorDto Crear(CreateJugadorDto dto);
}