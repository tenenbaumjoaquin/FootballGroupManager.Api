using FootballGroupManager.Application.DTOs;
using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Domain.DomainExceptions;
using Microsoft.AspNetCore.Mvc;

namespace FootballGroupManager.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JugadoresController : ControllerBase
    {
        private readonly IJugadorService _service;

        public JugadoresController(IJugadorService service)
        {
            _service = service;
        }

        // GET api/jugadores
        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var jugadores = await _service.ObtenerTodosAsync();
            return Ok(jugadores);
        }

        // GET api/jugadores/5
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var jugador = await _service.ObtenerPorIdAsync(id);
            if (jugador is null)
                return NotFound($"No se encontró un jugador con ID {id}.");
            return Ok(jugador);
        }

        // POST api/jugadores
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] CreateJugadorDto dto)
        {
            var jugador = await _service.CrearAsync(dto);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = jugador.Id }, jugador);
        }

        // PUT api/jugadores/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Actualizar(int id, [FromBody] UpdateJugadorDto dto)
        {
            var jugador = await _service.ActualizarAsync(id, dto);
            return Ok(jugador);
        }

        // DELETE api/jugadores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            await _service.EliminarAsync(id);
            return NoContent();
        }
    }
}