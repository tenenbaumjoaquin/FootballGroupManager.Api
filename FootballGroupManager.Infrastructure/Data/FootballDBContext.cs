using FootballGroupManager.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace FootballGroupManager.Infrastructure.Data
{
    public class FootballDbContext : DbContext
    {
        public FootballDbContext(DbContextOptions<FootballDbContext> options)
            : base(options) { }

        public DbSet<Jugador> Jugadores => Set<Jugador>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Jugador>(entity =>
            {
                entity.ToTable("Jugadores");

                entity.HasKey(j => j.Id);

                entity.Property(j => j.Id)
                    .ValueGeneratedOnAdd();

                entity.Property(j => j.Nombre)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(j => j.Posicion)
                    .IsRequired()
                    .HasMaxLength(3);

                entity.Property(j => j.Calificacion)
                    .IsRequired()
                    .HasMaxLength(1);

                entity.Property(j => j.PuntajeTotal)
                    .HasColumnType("decimal(4,2)");

                entity.OwnsOne(j => j.Stats, stats =>
                {
                    stats.UsePropertyAccessMode(PropertyAccessMode.Field);
                    stats.Property(s => s.Velocidad).HasColumnName("VEL").IsRequired();
                    stats.Property(s => s.Aguante).HasColumnName("AGT").IsRequired();
                    stats.Property(s => s.Pase).HasColumnName("PAS").IsRequired();
                    stats.Property(s => s.Gambeta).HasColumnName("GMB").IsRequired();
                    stats.Property(s => s.Defensa).HasColumnName("DEF").IsRequired();
                    stats.Property(s => s.Fisico).HasColumnName("FIS").IsRequired();
                    stats.Property(s => s.Pegada).HasColumnName("PEG").IsRequired();
                    stats.Property(s => s.Tiro).HasColumnName("TIR").IsRequired();
                    stats.Property(s => s.Atajada).HasColumnName("ATJ").IsRequired();
                    stats.Property(s => s.Reflejo).HasColumnName("REF").IsRequired();
                });
            });
        }
    }
}   