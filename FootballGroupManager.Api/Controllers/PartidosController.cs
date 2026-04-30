using FootballGroupManager.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FootballGroupManager.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PartidosController : ControllerBase
    {
        private readonly IPartidoService _service;

        public PartidosController(IPartidoService service)
        {
            _service = service;
        }

        private int ObtenerUsuarioId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // GET api/partidos/grupo/5/activo
        [HttpGet("grupo/{grupoId}/activo")]
        public async Task<IActionResult> ObtenerActivo(int grupoId)
        {
            var partido = await _service.ObtenerActivoPorGrupoAsync(grupoId);
            if (partido is null)
                return NotFound($"No hay un partido activo en el grupo {grupoId}.");
            return Ok(partido);
        }

        // GET api/partidos/grupo/5/historial
        [HttpGet("grupo/{grupoId}/historial")]
        public async Task<IActionResult> ObtenerHistorial(int grupoId)
        {
            var partidos = await _service.ObtenerHistorialPorGrupoAsync(grupoId);
            return Ok(partidos);
        }

        // POST api/partidos/grupo/5
        [HttpPost("grupo/{grupoId}")]
        public async Task<IActionResult> Crear(int grupoId)
        {
            var partido = await _service.CrearAsync(grupoId);
            return CreatedAtAction(nameof(ObtenerActivo), new { grupoId }, partido);
        }

        // POST api/partidos/5/confirmar
        [HttpPost("{partidoId}/confirmar")]
        public async Task<IActionResult> ConfirmarAsistencia(int partidoId)
        {
            var partido = await _service.ConfirmarAsistenciaAsync(partidoId, ObtenerUsuarioId());
            return Ok(partido);
        }

        // DELETE api/partidos/5/cancelar
        [HttpDelete("{partidoId}/cancelar")]
        public async Task<IActionResult> CancelarAsistencia(int partidoId)
        {
            var partido = await _service.CancelarAsistenciaAsync(partidoId, ObtenerUsuarioId());
            return Ok(partido);
        }

        // POST api/partidos/5/equipos
        [HttpPost("{partidoId}/equipos")]
        public async Task<IActionResult> GenerarEquipos(int partidoId)
        {
            var partido = await _service.GenerarEquiposAsync(partidoId);
            return Ok(partido);
        }

        // POST api/partidos/5/jugado
        [HttpPost("{partidoId}/jugado")]
        public async Task<IActionResult> MarcarComoJugado(int partidoId)
        {
            var partido = await _service.MarcarComoJugadoAsync(partidoId);
            return Ok(partido);
        }
    }
}