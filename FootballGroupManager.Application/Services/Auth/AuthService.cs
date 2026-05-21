using FootballGroupManager.Application.DTOs.Auth;
using FootballGroupManager.Application.DTOs.Usuario;
using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Application.Mappings;
using FootballGroupManager.Domain.DomainExceptions;
using FootballGroupManager.Domain.ValueObjects;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FootballGroupManager.Application.Services.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IUsuarioRepository _usuarioRepositorio;
        private readonly IConfiguration _configuration;

        public AuthService(IUsuarioRepository usuarioRepositorio, IConfiguration configuration)
        {
            _usuarioRepositorio = usuarioRepositorio;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
        {
            var usuario = await _usuarioRepositorio.ObtenerPorEmailAsync(dto.Email)
                ?? throw new DomainException("Email o contraseña incorrectos.");

            if (!BCrypt.Net.BCrypt.Verify(dto.Password, usuario.PasswordHash))
                throw new DomainException("Email o contraseña incorrectos.");

            return GenerarToken(usuario);
        }

        public async Task<AuthResponseDto> RegistrarAsync(CreateUsuarioDto dto)
        {
            var emailExistente = await _usuarioRepositorio.ObtenerPorEmailAsync(dto.Email);
            if (emailExistente is not null)
                throw new DomainException($"El email '{dto.Email}' ya está registrado.");

            var nombreExistente = await _usuarioRepositorio.ObtenerPorNombreUsuarioAsync(dto.NombreUsuario);
            if (nombreExistente is not null)
                throw new DomainException($"El nombre de usuario '{dto.NombreUsuario}' ya está en uso.");

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);
            var estadisticas = UsuarioMapper.ToEstadisticas(dto.Stats);

            var usuario = new Domain.Entities.Usuario(
                dto.NombreUsuario,
                dto.Email,
                passwordHash,
                dto.Nombre,
                dto.Posicion,
                estadisticas,
                dto.Avatar != null ? new AvatarConfig
                {
                    Cabeza = dto.Avatar.Cabeza,
                    Pelo = dto.Avatar.Pelo,
                    ColorPelo = dto.Avatar.ColorPelo,
                    Ojos = dto.Avatar.Ojos,
                    ColorOjos = dto.Avatar.ColorOjos,
                    Cara = dto.Avatar.Cara,
                    ColorPiel = dto.Avatar.ColorPiel,
                    Vello = dto.Avatar.Vello,
                    ColorVello = dto.Avatar.ColorVello,
                    Accesorio = dto.Avatar.Accesorio,
                    Camiseta = dto.Avatar.Camiseta,
                    ColorCamisetaPrincipal = dto.Avatar.ColorCamisetaPrincipal,
                    ColorCamisetaSecundario = dto.Avatar.ColorCamisetaSecundario,
                    Fondo = dto.Avatar.Fondo,
                } : new AvatarConfig()
            );

            await _usuarioRepositorio.AgregarAsync(usuario);
            return GenerarToken(usuario);
        }

        private AuthResponseDto GenerarToken(Domain.Entities.Usuario usuario)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"]!;
            var issuer = jwtSettings["Issuer"]!;
            var audience = jwtSettings["Audience"]!;
            var expirationHours = int.Parse(jwtSettings["ExpirationHours"]!);

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expiracion = DateTime.UtcNow.AddHours(expirationHours);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, usuario.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, usuario.Email),
                new Claim(JwtRegisteredClaimNames.UniqueName, usuario.NombreUsuario),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: expiracion,
                signingCredentials: credentials
            );

            return new AuthResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiracion = expiracion,
                UsuarioId = usuario.Id,
                NombreUsuario = usuario.NombreUsuario,
                Email = usuario.Email
            };
        }
    }
}