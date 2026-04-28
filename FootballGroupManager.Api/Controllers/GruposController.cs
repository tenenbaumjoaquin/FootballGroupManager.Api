using FootballGroupManager.Application.DTOs.Grupo;
using FootballGroupManager.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FootballGroupManager.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GruposController : ControllerBase
    {
        private readonly IGrupoService _service;

        public GruposController(IGrupoService service)
        {
            _service = service;
        }

        // GET api/grupos/usuario/5
        [HttpGet("usuario/{usuarioId}")]
        public async Task<IActionResult> ObtenerPorUsuario(int usuarioId)
        {
            var grupos = await _service.ObtenerPorUsuarioAsync(usuarioId);
            return Ok(grupos);
        }

        // GET api/grupos/5
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var grupo = await _service.ObtenerPorIdAsync(id);
            if (grupo is null)
                return NotFound($"No se encontró un grupo con ID {id}.");
            return Ok(grupo);
        }

        // POST api/grupos/usuario/5
        [HttpPost("usuario/{usuarioId}")]
        public async Task<IActionResult> Crear(int usuarioId, [FromBody] CreateGrupoDto dto)
        {
            var grupo = await _service.CrearAsync(usuarioId, dto);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = grupo.Id }, grupo);
        }

        // POST api/grupos/unirse/usuario/5
        [HttpPost("unirse/usuario/{usuarioId}")]
        public async Task<IActionResult> Unirse(int usuarioId, [FromQuery] string codigo)
        {
            var grupo = await _service.UnirseAsync(usuarioId, codigo);
            return Ok(grupo);
        }

        // DELETE api/grupos/5/usuario/5
        [HttpDelete("{grupoId}/usuario/{usuarioId}")]
        public async Task<IActionResult> Eliminar(int grupoId, int usuarioId)
        {
            await _service.EliminarAsync(usuarioId, grupoId);
            return NoContent();
        }

        // DELETE api/grupos/5/abandonar/usuario/5
        [HttpDelete("{grupoId}/abandonar/usuario/{usuarioId}")]
        public async Task<IActionResult> Abandonar(int grupoId, int usuarioId)
        {
            await _service.AbandonarAsync(usuarioId, grupoId);
            return NoContent();
        }
    }
}