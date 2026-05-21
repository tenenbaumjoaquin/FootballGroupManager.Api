using FootballGroupManager.Application.DTOs.Usuario;
using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Application.Mappings;
using FootballGroupManager.Domain.DomainExceptions;
using FootballGroupManager.Domain.Entities;
using FootballGroupManager.Domain.ValueObjects;

namespace FootballGroupManager.Application.Services.Usuarios
{
    public class UsuarioService : IUsuarioService
    {
        private readonly IUsuarioRepository _repositorio;

        public UsuarioService(IUsuarioRepository repositorio)
        {
            _repositorio = repositorio;
        }

        public async Task<IEnumerable<UsuarioDto>> ObtenerTodosAsync()
        {
            var usuarios = await _repositorio.ObtenerTodosAsync();
            return usuarios.Select(UsuarioMapper.ToDto);
        }

        public async Task<UsuarioDto?> ObtenerPorIdAsync(int id)
        {
            var usuario = await _repositorio.ObtenerPorIdAsync(id);
            return usuario is null ? null : UsuarioMapper.ToDto(usuario);
        }

        public async Task<UsuarioDto> CrearAsync(CreateUsuarioDto dto)
        {
            // Verificar que el email no esté en uso
            var emailExistente = await _repositorio.ObtenerPorEmailAsync(dto.Email);
            if (emailExistente is not null)
                throw new DomainException($"El email '{dto.Email}' ya está registrado.");

            // Verificar que el nombre de usuario no esté en uso
            var nombreExistente = await _repositorio.ObtenerPorNombreUsuarioAsync(dto.NombreUsuario);
            if (nombreExistente is not null)
                throw new DomainException($"El nombre de usuario '{dto.NombreUsuario}' ya está en uso.");

            // Hashear la contraseña
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            // Crear las estadísticas
            var estadisticas = UsuarioMapper.ToEstadisticas(dto.Stats);

            // Crear el usuario
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

            await _repositorio.AgregarAsync(usuario);
            return UsuarioMapper.ToDto(usuario);
        }

        public async Task<UsuarioDto> ActualizarPerfilAsync(int id, UpdateUsuarioDto dto)
        {
            var usuario = await _repositorio.ObtenerPorIdAsync(id)
                ?? throw new DomainException($"No se encontró un usuario con ID {id}.");

            var estadisticas = UsuarioMapper.ToEstadisticas(dto.Stats);
            usuario.ActualizarPerfil(dto.Nombre, dto.Posicion, estadisticas);

            await _repositorio.ActualizarAsync(usuario);
            return UsuarioMapper.ToDto(usuario);
        }

        public async Task EliminarAsync(int id)
        {
            var usuario = await _repositorio.ObtenerPorIdAsync(id)
                ?? throw new DomainException($"No se encontró un usuario con ID {id}.");

            await _repositorio.EliminarAsync(usuario.Id);
        }
    }
}