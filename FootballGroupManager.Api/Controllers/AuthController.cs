using FootballGroupManager.Application.DTOs.Auth;
using FootballGroupManager.Application.DTOs.Usuario;
using FootballGroupManager.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FootballGroupManager.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        // POST api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var response = await _service.LoginAsync(dto);
            return Ok(response);
        }

        // POST api/auth/registro
        [HttpPost("registro")]
        public async Task<IActionResult> Registro([FromBody] CreateUsuarioDto dto)
        {
            var response = await _service.RegistrarAsync(dto);
            return CreatedAtAction(nameof(Login), response);
        }
    }
}