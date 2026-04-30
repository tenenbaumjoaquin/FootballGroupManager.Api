// UpdateUsuarioDtoValidator.cs
using FluentValidation;
using FootballGroupManager.Application.DTOs.Usuario;

namespace FootballGroupManager.Application.Validators
{
    public class UpdateUsuarioDtoValidator : AbstractValidator<UpdateUsuarioDto>
    {
        public UpdateUsuarioDtoValidator()
        {
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