using FluentValidation;
using FootballGroupManager.Application.DTOs.Usuario;

namespace FootballGroupManager.Application.Validators
{
    public class CreateUsuarioDtoValidator : AbstractValidator<CreateUsuarioDto>
    {
        public CreateUsuarioDtoValidator()
        {
            RuleFor(x => x.NombreUsuario)
                .NotEmpty().WithMessage("El nombre de usuario es obligatorio.")
                .MinimumLength(3).WithMessage("El nombre de usuario debe tener al menos 3 caracteres.")
                .MaximumLength(50).WithMessage("El nombre de usuario no puede superar los 50 caracteres.")
                .Matches("^[a-zA-Z0-9_]+$").WithMessage("El nombre de usuario solo puede contener letras, números y guiones bajos.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("El email es obligatorio.")
                .EmailAddress().WithMessage("El email no tiene un formato válido.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("La contraseña es obligatoria.")
                .MinimumLength(6).WithMessage("La contraseña debe tener al menos 6 caracteres.");

            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre es obligatorio.")
                .MaximumLength(100).WithMessage("El nombre no puede superar los 100 caracteres.");

            RuleFor(x => x.Posicion)
                .NotEmpty().WithMessage("La posición es obligatoria.")
                .Must(p => new[] { "ARQ", "DEF", "VOL", "DEL" }.Contains(p))
                .WithMessage("La posición debe ser ARQ, DEF, VOL o DEL.");

            RuleFor(x => x.Stats)
                .SetValidator(new StatsValidator());
        }
    }
}