using FootballGroupManager.Domain.DomainExceptions;
using FootballGroupManager.Domain.Enums;

namespace FootballGroupManager.Domain.Entities
{
    public class Partido
    {
        public int Id { get; private set; }
        public int GrupoId { get; private set; }
        public Grupo Grupo { get; private set; } = null!;
        public DateTime FechaCreacion { get; private set; }
        public DateTime? FechaJugado { get; private set; }
        public EstadoPartido Estado { get; private set; }

        private readonly List<PartidoJugador> _jugadores = new();
        public IReadOnlyList<PartidoJugador> Jugadores => _jugadores;

        private const int MaximoJugadores = 10;

        // Constructor privado para EF Core
        private Partido()
        {
            Grupo = null!;
        }

        public Partido(Grupo grupo)
        {
            if (grupo is null)
                throw new DomainException("El partido debe pertenecer a un grupo.");

            // Solo puede haber un partido abierto o cerrado por grupo a la vez
            if (grupo.Partidos.Any(p => p.Estado == EstadoPartido.Abierto
                                     || p.Estado == EstadoPartido.Cerrado))
                throw new DomainException("El grupo ya tiene un partido en curso.");

            GrupoId = grupo.Id;
            Grupo = grupo;
            FechaCreacion = DateTime.UtcNow;
            Estado = EstadoPartido.Abierto;
        }

        public void ConfirmarAsistencia(Usuario usuario)
        {
            if (Estado != EstadoPartido.Abierto)
                throw new DomainException("El partido no está abierto para confirmaciones.");

            if (_jugadores.Count >= MaximoJugadores)
                throw new DomainException($"El partido ya tiene {MaximoJugadores} jugadores confirmados.");

            if (_jugadores.Any(j => j.UsuarioId == usuario.Id))
                throw new DomainException($"{usuario.NombreUsuario} ya confirmó su asistencia.");

            // Verificar que el usuario es miembro del grupo
            if (!Grupo.Miembros.Any(m => m.UsuarioId == usuario.Id)
                && Grupo.CreadorId != usuario.Id)
                throw new DomainException($"{usuario.NombreUsuario} no es miembro de este grupo.");

            _jugadores.Add(new PartidoJugador(usuario, this));
        }

        public void CancelarAsistencia(int usuarioId)
        {
            if (Estado != EstadoPartido.Abierto)
                throw new DomainException("No se puede cancelar asistencia — el partido ya no está abierto.");

            var jugador = _jugadores.FirstOrDefault(j => j.UsuarioId == usuarioId)
                ?? throw new DomainException("El usuario no confirmó asistencia en este partido.");

            _jugadores.Remove(jugador);
        }

        public (List<PartidoJugador> equipoA, List<PartidoJugador> equipoB) GenerarEquipos()
        {
            if (Estado != EstadoPartido.Abierto)
                throw new DomainException("El partido no está abierto.");

            if (_jugadores.Count != MaximoJugadores)
                throw new DomainException($"Se necesitan exactamente {MaximoJugadores} jugadores para generar equipos.");

            var (equipoA, equipoB) = BalancearEquipos();

            foreach (var jugador in equipoA)
                jugador.AsignarEquipo(Equipo.A);

            foreach (var jugador in equipoB)
                jugador.AsignarEquipo(Equipo.B);

            Estado = EstadoPartido.Cerrado;
            return (equipoA, equipoB);
        }

        public void MarcarComoJugado()
        {
            if (Estado != EstadoPartido.Cerrado)
                throw new DomainException("El partido debe estar cerrado antes de marcarlo como jugado.");

            Estado = EstadoPartido.Jugado;
            FechaJugado = DateTime.UtcNow;
        }

        public void AsignarId(int id)
        {
            if (Id != 0)
                throw new DomainException("El ID ya fue asignado.");
            if (id <= 0)
                throw new DomainException("El ID debe ser mayor a cero.");
            Id = id;
        }

        private (List<PartidoJugador> equipoA, List<PartidoJugador> equipoB) BalancearEquipos()
        {
            var equipoA = new List<PartidoJugador>();
            var equipoB = new List<PartidoJugador>();

            // Paso 1 — Separar arqueros
            var arqueros = _jugadores
                .Where(j => j.Usuario.Posicion == "ARQ")
                .OrderByDescending(j => j.Usuario.PuntajeTotal)
                .ToList();

            var restantes = _jugadores
                .Where(j => j.Usuario.Posicion != "ARQ")
                .OrderByDescending(j => j.Usuario.PuntajeTotal)
                .ToList();

            // Paso 2 — Distribuir arqueros
            if (arqueros.Count >= 2)
            {
                // Hay arqueros para los dos equipos — el mejor va al equipo con menos puntaje
                equipoA.Add(arqueros[0]);
                equipoB.Add(arqueros[1]);

                // Si hay más arqueros, se tratan como jugadores de campo
                restantes.AddRange(arqueros.Skip(2));
                restantes = restantes.OrderByDescending(j => j.Usuario.PuntajeTotal).ToList();
            }
            else if (arqueros.Count == 1)
            {
                // Solo un arquero — va al equipo A, el equipo B pone su mejor jugador de campo
                equipoA.Add(arqueros[0]);
            }
            else
            {
                // Sin arqueros — todos se tratan como jugadores de campo
            }

            // Paso 3 — Distribuir el resto con algoritmo greedy
            // Alternamos asignando cada jugador al equipo con menor puntaje acumulado
            foreach (var jugador in restantes)
            {
                double puntajeA = equipoA.Sum(j => j.Usuario.PuntajeTotal);
                double puntajeB = equipoB.Sum(j => j.Usuario.PuntajeTotal);

                if (equipoA.Count < 5 && (puntajeA <= puntajeB || equipoB.Count >= 5))
                    equipoA.Add(jugador);
                else
                    equipoB.Add(jugador);
            }

            return (equipoA, equipoB);
        }
    }
}