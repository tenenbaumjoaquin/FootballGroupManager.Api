using FootballGroupManager.Application.DTOs;
using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Application.Mapping;
using FootballGroupManager.Domain.DomainExceptions;
using FootballGroupManager.Domain.Entities;

namespace FootballGroupManager.Application.Services.Jugadores
{
    public class JugadorService : IJugadorService
    {
        private readonly IJugadorRepository _repositorio;

        public JugadorService(IJugadorRepository repositorio)
        {
            _repositorio = repositorio;
        }

        public async Task<IEnumerable<JugadorDto>> ObtenerTodosAsync()
        {
            var jugadores = await _repositorio.ObtenerTodosAsync();
            return jugadores.Select(JugadorMapper.ToDto);
        }

        public async Task<JugadorDto?> ObtenerPorIdAsync(int id)
        {
            var jugador = await _repositorio.ObtenerPorIdAsync(id);
            return jugador is null ? null : JugadorMapper.ToDto(jugador);
        }

        public async Task<JugadorDto> CrearAsync(CreateJugadorDto dto)
        {
            var estadisticas = JugadorMapper.ToEstadisticas(dto.Stats);
            var jugador = new Jugador(0, dto.Nombre, dto.Posicion, estadisticas);
            await _repositorio.AgregarAsync(jugador);
            return JugadorMapper.ToDto(jugador);
        }

        public async Task<JugadorDto> ActualizarAsync(int id, UpdateJugadorDto dto)
        {
            var jugador = await _repositorio.ObtenerPorIdAsync(id)
                ?? throw new DomainException($"No se encontró un jugador con ID {id}.");

            // Solo actualizamos lo que viene en el DTO
            if (!string.IsNullOrWhiteSpace(dto.Nombre))
                jugador.ActualizarNombre(dto.Nombre);

            if (!string.IsNullOrWhiteSpace(dto.Posicion))
                jugador.ActualizarPosicion(dto.Posicion);

            if (dto.Stats is not null && dto.Stats.Any())
            {
                var estadisticas = JugadorMapper.ToEstadisticas(dto.Stats);
                jugador.CargarStats(estadisticas);
            }

            await _repositorio.ActualizarAsync(jugador);
            return JugadorMapper.ToDto(jugador);
        }

        public async Task EliminarAsync(int id)
        {
            var jugador = await _repositorio.ObtenerPorIdAsync(id)
                ?? throw new DomainException($"No se encontró un jugador con ID {id}.");

            await _repositorio.EliminarAsync(jugador.Id);
        }
    }
}