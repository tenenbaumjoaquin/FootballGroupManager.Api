using FootballGroupManager.Application.DTOs.Usuario;
using FootballGroupManager.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FootballGroupManager.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _service;

        public UsuariosController(IUsuarioService service)
        {
            _service = service;
        }

        private int ObtenerUsuarioId() =>
            int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        // GET api/usuarios/me
        [HttpGet("me")]
        public async Task<IActionResult> ObtenerMiPerfil()
        {
            var usuario = await _service.ObtenerPorIdAsync(ObtenerUsuarioId());
            if (usuario is null)
                return NotFound();
            return Ok(usuario);
        }

        // PUT api/usuarios/me
        [HttpPut("me")]
        public async Task<IActionResult> ActualizarMiPerfil([FromBody] UpdateUsuarioDto dto)
        {
            var usuario = await _service.ActualizarPerfilAsync(ObtenerUsuarioId(), dto);
            return Ok(usuario);
        }

        // DELETE api/usuarios/me
        [HttpDelete("me")]
        public async Task<IActionResult> EliminarMiCuenta()
        {
            await _service.EliminarAsync(ObtenerUsuarioId());
            return NoContent();
        }
    }
}