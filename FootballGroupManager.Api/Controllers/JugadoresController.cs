using FootballGroupManager.Application.DTOs;
using FootballGroupManager.Application.Services.Jugadores;
using Microsoft.AspNetCore.Mvc;

namespace FootballGroupManager.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class JugadoresController : ControllerBase
{
    private readonly JugadorService _service;

    public JugadoresController(JugadorService service)
    {
        _service = service;
    }

    [HttpPost]
    public IActionResult Crear(CreateJugadorDto dto)
    {
        var stats = new Dictionary<string, int>
        {
            {"VEL", dto.VEL},
            {"AGT", dto.AGT},
            {"PAS", dto.PAS},
            {"GMB", dto.GMB},
            {"DEF", dto.DEF},
            {"FIS", dto.FIS},
            {"PEG", dto.PEG},
            {"TIR", dto.TIR},
            {"ATJ", dto.ATJ},
            {"REF", dto.REF}
        };

        var jugador = _service.Crear(dto);

        return Ok(jugador);
    }
}