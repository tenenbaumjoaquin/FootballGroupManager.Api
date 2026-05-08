using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FootballGroupManager.Application.DTOs.Partido
{
    public class ActualizarDetallesPartidoDto
    {
        public DateTime? FechaHora { get; set; }
        public string? Direccion { get; set; }
        public double? Latitud { get; set; }
        public double? Longitud { get; set; }
    }
}
