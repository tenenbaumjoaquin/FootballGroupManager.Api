using FluentValidation;

namespace FootballGroupManager.Application.Validators
{
    public class StatsValidator : AbstractValidator<Dictionary<string, int>>
    {
        private static readonly string[] StatsValidas =
            { "VEL", "AGT", "PAS", "GMB", "DEF", "FIS", "PEG", "TIR", "ATJ", "REF" };

        public StatsValidator()
        {
            RuleFor(stats => stats)
                .NotNull().WithMessage("Las estadísticas son obligatorias.")
                .Must(s => s.Count == 10).WithMessage("Deben enviarse exactamente 10 estadísticas.")
                .Must(s => s.Keys.All(k => StatsValidas.Contains(k)))
                .WithMessage($"Las stats válidas son: {string.Join(", ", StatsValidas)}.");

            RuleForEach(stats => stats)
                .Must(kvp => kvp.Value >= 0 && kvp.Value <= 10)
                .WithMessage("Cada estadística debe tener un valor entre 0 y 10.");
        }
    }
}