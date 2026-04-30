using FootballGroupManager.Application.DTOs.Grupo;
using FootballGroupManager.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FootballGroupManager.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GruposController : ControllerBase
    {
        private readonly IGrupoService _service;

        public GruposController(IGrupoService service)
        {
            _service = service;
        }

        private int ObtenerUsuarioId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // GET api/grupos
        [HttpGet]
        public async Task<IActionResult> ObtenerMisGrupos()
        {
            var grupos = await _service.ObtenerPorUsuarioAsync(ObtenerUsuarioId());
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

        // POST api/grupos
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] CreateGrupoDto dto)
        {
            var grupo = await _service.CrearAsync(ObtenerUsuarioId(), dto);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = grupo.Id }, grupo);
        }

        // POST api/grupos/unirse
        [HttpPost("unirse")]
        public async Task<IActionResult> Unirse([FromQuery] string codigo)
        {
            var grupo = await _service.UnirseAsync(ObtenerUsuarioId(), codigo);
            return Ok(grupo);
        }

        // DELETE api/grupos/5
        [HttpDelete("{grupoId}")]
        public async Task<IActionResult> Eliminar(int grupoId)
        {
            await _service.EliminarAsync(ObtenerUsuarioId(), grupoId);
            return NoContent();
        }

        // DELETE api/grupos/5/abandonar
        [HttpDelete("{grupoId}/abandonar")]
        public async Task<IActionResult> Abandonar(int grupoId)
        {
            await _service.AbandonarAsync(ObtenerUsuarioId(), grupoId);
            return NoContent();
        }
    }
}