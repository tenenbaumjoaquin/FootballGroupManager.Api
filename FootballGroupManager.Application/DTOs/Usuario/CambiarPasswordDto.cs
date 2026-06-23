using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FootballGroupManager.Application.DTOs.Usuario
{
    public class CambiarPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string NuevaPassword { get; set; } = string.Empty;
    }
}