using FluentValidation;
using FootballGroupManager.Application.DTOs.Grupo;

namespace FootballGroupManager.Application.Validators
{
    public class CreateGrupoDtoValidator : AbstractValidator<CreateGrupoDto>
    {
        public CreateGrupoDtoValidator()
        {
            RuleFor(x => x.Nombre)
                .NotEmpty().WithMessage("El nombre del grupo es obligatorio.")
                .MinimumLength(3).WithMessage("El nombre debe tener al menos 3 caracteres.")
                .MaximumLength(100).WithMessage("El nombre no puede superar los 100 caracteres.");
        }
    }
}