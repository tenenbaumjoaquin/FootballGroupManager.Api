using FootballGroupManager.Application.DTOs.Usuario;
using FootballGroupManager.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FootballGroupManager.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuarioService _service;

        public UsuariosController(IUsuarioService service)
        {
            _service = service;
        }

        // GET api/usuarios
        [HttpGet]
        public async Task<IActionResult> ObtenerTodos()
        {
            var usuarios = await _service.ObtenerTodosAsync();
            return Ok(usuarios);
        }

        // GET api/usuarios/5
        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerPorId(int id)
        {
            var usuario = await _service.ObtenerPorIdAsync(id);
            if (usuario is null)
                return NotFound($"No se encontró un usuario con ID {id}.");
            return Ok(usuario);
        }

        // POST api/usuarios
        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] CreateUsuarioDto dto)
        {
            var usuario = await _service.CrearAsync(dto);
            return CreatedAtAction(nameof(ObtenerPorId), new { id = usuario.Id }, usuario);
        }

        // PUT api/usuarios/5
        [HttpPut("{id}")]
        public async Task<IActionResult> ActualizarPerfil(int id, [FromBody] UpdateUsuarioDto dto)
        {
            var usuario = await _service.ActualizarPerfilAsync(id, dto);
            return Ok(usuario);
        }

        // DELETE api/usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            await _service.EliminarAsync(id);
            return NoContent();
        }
    }
}