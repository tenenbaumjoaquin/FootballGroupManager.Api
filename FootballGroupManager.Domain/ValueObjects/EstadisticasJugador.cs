using FootballGroupManager.Domain.DomainExceptions;

namespace FootballGroupManager.Domain.ValueObjects
{
    public sealed class EstadisticasJugador
    {
        public int Velocidad { get; }   // VEL
        public int Aguante { get; }   // AGT
        public int Pase { get; }   // PAS
        public int Gambeta { get; }   // GMB
        public int Defensa { get; }   // DEF
        public int Fisico { get; }   // FIS
        public int Pegada { get; }   // PEG
        public int Tiro { get; }   // TIR
        public int Atajada { get; }   // ATJ
        public int Reflejo { get; }   // REF

        public EstadisticasJugador(
            int velocidad, int aguante, int pase, int gambeta, int defensa,
            int fisico, int pegada, int tiro, int atajada, int reflejo)
        {
            ValidarRango(velocidad, nameof(Velocidad));
            ValidarRango(aguante, nameof(Aguante));
            ValidarRango(pase, nameof(Pase));
            ValidarRango(gambeta, nameof(Gambeta));
            ValidarRango(defensa, nameof(Defensa));
            ValidarRango(fisico, nameof(Fisico));
            ValidarRango(pegada, nameof(Pegada));
            ValidarRango(tiro, nameof(Tiro));
            ValidarRango(atajada, nameof(Atajada));
            ValidarRango(reflejo, nameof(Reflejo));

            Velocidad = velocidad;
            Aguante = aguante;
            Pase = pase;
            Gambeta = gambeta;
            Defensa = defensa;
            Fisico = fisico;
            Pegada = pegada;
            Tiro = tiro;
            Atajada = atajada;
            Reflejo = reflejo;
        }

        // "Actualizar" una stat crea una nueva instancia — no muta la existente
        public EstadisticasJugador ConStat(string nombreCorto, int valor)
        {
            ValidarRango(valor, nombreCorto);
            return nombreCorto switch
            {
                "VEL" => new EstadisticasJugador(valor, Aguante, Pase, Gambeta, Defensa, Fisico, Pegada, Tiro, Atajada, Reflejo),
                "AGT" => new EstadisticasJugador(Velocidad, valor, Pase, Gambeta, Defensa, Fisico, Pegada, Tiro, Atajada, Reflejo),
                "PAS" => new EstadisticasJugador(Velocidad, Aguante, valor, Gambeta, Defensa, Fisico, Pegada, Tiro, Atajada, Reflejo),
                "GMB" => new EstadisticasJugador(Velocidad, Aguante, Pase, valor, Defensa, Fisico, Pegada, Tiro, Atajada, Reflejo),
                "DEF" => new EstadisticasJugador(Velocidad, Aguante, Pase, Gambeta, valor, Fisico, Pegada, Tiro, Atajada, Reflejo),
                "FIS" => new EstadisticasJugador(Velocidad, Aguante, Pase, Gambeta, Defensa, valor, Pegada, Tiro, Atajada, Reflejo),
                "PEG" => new EstadisticasJugador(Velocidad, Aguante, Pase, Gambeta, Defensa, Fisico, valor, Tiro, Atajada, Reflejo),
                "TIR" => new EstadisticasJugador(Velocidad, Aguante, Pase, Gambeta, Defensa, Fisico, Pegada, valor, Atajada, Reflejo),
                "ATJ" => new EstadisticasJugador(Velocidad, Aguante, Pase, Gambeta, Defensa, Fisico, Pegada, Tiro, valor, Reflejo),
                "REF" => new EstadisticasJugador(Velocidad, Aguante, Pase, Gambeta, Defensa, Fisico, Pegada, Tiro, Atajada, valor),
                _ => throw new DomainException($"Stat desconocida: {nombreCorto}")
            };
        }

        // Igualdad por valor, no por referencia
        public override bool Equals(object? obj) =>
            obj is EstadisticasJugador other &&
            Velocidad == other.Velocidad && Aguante == other.Aguante &&
            Pase == other.Pase && Gambeta == other.Gambeta &&
            Defensa == other.Defensa && Fisico == other.Fisico &&
            Pegada == other.Pegada && Tiro == other.Tiro &&
            Atajada == other.Atajada && Reflejo == other.Reflejo;

        public override int GetHashCode()
        {
            var hash = new HashCode();
            hash.Add(Velocidad);
            hash.Add(Aguante);
            hash.Add(Pase);
            hash.Add(Gambeta);
            hash.Add(Defensa);
            hash.Add(Fisico);
            hash.Add(Pegada);
            hash.Add(Tiro);
            hash.Add(Atajada);
            hash.Add(Reflejo);
            return hash.ToHashCode();
        }

        private static void ValidarRango(int valor, string nombre)
        {
            if (valor < 0 || valor > 10)
                throw new DomainException($"{nombre} debe estar entre 0 y 10.");
        }
    }
}