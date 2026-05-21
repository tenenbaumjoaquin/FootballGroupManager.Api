using FootballGroupManager.Domain.Entities;
using FootballGroupManager.Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace FootballGroupManager.Infrastructure.Data
{
    public class FootballDbContext : DbContext
    {
        public FootballDbContext(DbContextOptions<FootballDbContext> options)
            : base(options) { }

        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<Grupo> Grupos => Set<Grupo>();
        public DbSet<GrupoUsuario> GrupoUsuarios => Set<GrupoUsuario>();
        public DbSet<Partido> Partidos => Set<Partido>();
        public DbSet<PartidoJugador> PartidoJugadores => Set<PartidoJugador>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ─── USUARIO ───────────────────────────────────────────────
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("Usuarios");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id).ValueGeneratedOnAdd();

                entity.Property(u => u.NombreUsuario)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(u => u.Email)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasIndex(u => u.Email).IsUnique();
                entity.HasIndex(u => u.NombreUsuario).IsUnique();

                entity.Property(u => u.PasswordHash)
                    .IsRequired();

                entity.Property(u => u.Nombre)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(u => u.Posicion)
                    .IsRequired()
                    .HasMaxLength(3);

                entity.Property(u => u.Calificacion)
                    .IsRequired()
                    .HasMaxLength(1);

                entity.Property(u => u.PuntajeTotal)
                    .HasColumnType("decimal(4,2)");

                entity.OwnsOne(u => u.Stats, stats =>
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
                entity.OwnsOne(u => u.Avatar, avatar =>
                {
                    avatar.Property(a => a.Cabeza).HasColumnName("Avatar_Cabeza").HasMaxLength(50);
                    avatar.Property(a => a.Pelo).HasColumnName("Avatar_Pelo").HasMaxLength(50);
                    avatar.Property(a => a.ColorPelo).HasColumnName("Avatar_ColorPelo").HasMaxLength(10);
                    avatar.Property(a => a.Ojos).HasColumnName("Avatar_Ojos").HasMaxLength(50);
                    avatar.Property(a => a.ColorOjos).HasColumnName("Avatar_ColorOjos").HasMaxLength(10);
                    avatar.Property(a => a.Cara).HasColumnName("Avatar_Cara").HasMaxLength(50);
                    avatar.Property(a => a.ColorPiel).HasColumnName("Avatar_ColorPiel").HasMaxLength(10);
                    avatar.Property(a => a.Vello).HasColumnName("Avatar_Vello").HasMaxLength(50);
                    avatar.Property(a => a.ColorVello).HasColumnName("Avatar_ColorVello").HasMaxLength(10);
                    avatar.Property(a => a.Accesorio).HasColumnName("Avatar_Accesorio").HasMaxLength(50);
                    avatar.Property(a => a.Camiseta).HasColumnName("Avatar_Camiseta").HasMaxLength(50);
                    avatar.Property(a => a.ColorCamisetaPrincipal).HasColumnName("Avatar_ColorCamisetaPrincipal").HasMaxLength(10);
                    avatar.Property(a => a.ColorCamisetaSecundario).HasColumnName("Avatar_ColorCamisetaSecundario").HasMaxLength(10);
                    avatar.Property(a => a.Fondo).HasColumnName("Avatar_Fondo").HasMaxLength(50);
                });
            });

            // ─── GRUPO ─────────────────────────────────────────────────
            modelBuilder.Entity<Grupo>(entity =>
            {
                entity.ToTable("Grupos");
                entity.HasKey(g => g.Id);
                entity.Property(g => g.Id).ValueGeneratedOnAdd();

                entity.Property(g => g.Nombre)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(g => g.Codigo)
                    .IsRequired()
                    .HasMaxLength(6);

                entity.HasIndex(g => g.Codigo).IsUnique();

                entity.Property(g => g.FechaCreacion).IsRequired();

                entity.HasOne(g => g.Creador)
                    .WithMany(u => u.GruposCreados)
                    .HasForeignKey(g => g.CreadorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ─── GRUPO USUARIO ──────────────────────────────────────────
            modelBuilder.Entity<GrupoUsuario>(entity =>
            {
                entity.ToTable("GrupoUsuarios");

                // Clave primaria compuesta — un usuario no puede estar dos veces en el mismo grupo
                entity.HasKey(gu => new { gu.GrupoId, gu.UsuarioId });

                entity.Property(gu => gu.FechaIngreso).IsRequired();
                entity.Property(gu => gu.EsCapitan).IsRequired();

                entity.HasOne(gu => gu.Grupo)
                    .WithMany(g => g.Miembros)
                    .HasForeignKey(gu => gu.GrupoId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(gu => gu.Usuario)
                    .WithMany(u => u.Membresias)
                    .HasForeignKey(gu => gu.UsuarioId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ─── PARTIDO ───────────────────────────────────────────────
            modelBuilder.Entity<Partido>(entity =>
            {
                entity.ToTable("Partidos");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id).ValueGeneratedOnAdd();

                entity.Property(p => p.FechaCreacion).IsRequired();
                entity.Property(p => p.FechaJugado).IsRequired(false);

                entity.Property(p => p.Estado)
                    .IsRequired()
                    .HasConversion<string>(); // Guarda "Abierto", "Cerrado", "Jugado" en lugar de 0, 1, 2

                entity.HasOne(p => p.Grupo)
                    .WithMany(g => g.Partidos)
                    .HasForeignKey(p => p.GrupoId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ─── PARTIDO JUGADOR ────────────────────────────────────────
            modelBuilder.Entity<PartidoJugador>(entity =>
            {
                entity.ToTable("PartidoJugadores");

                // Clave primaria compuesta
                entity.HasKey(pj => new { pj.PartidoId, pj.UsuarioId });

                entity.Property(pj => pj.FechaConfirmacion).IsRequired();

                entity.Property(pj => pj.EquipoAsignado)
                    .IsRequired(false)
                    .HasConversion<string>(); // Guarda "A" o "B" en lugar de 0 o 1

                entity.HasOne(pj => pj.Partido)
                    .WithMany(p => p.Jugadores)
                    .HasForeignKey(pj => pj.PartidoId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(pj => pj.Usuario)
                    .WithMany()
                    .HasForeignKey(pj => pj.UsuarioId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }
    }
}