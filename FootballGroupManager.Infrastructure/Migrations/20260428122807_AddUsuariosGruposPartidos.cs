using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootballGroupManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddUsuariosGruposPartidos : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Jugadores");

            migrationBuilder.CreateTable(
                name: "Usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreUsuario = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Posicion = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    Calificacion = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    PuntajeTotal = table.Column<decimal>(type: "decimal(4,2)", nullable: false),
                    VEL = table.Column<int>(type: "int", nullable: true),
                    AGT = table.Column<int>(type: "int", nullable: true),
                    PAS = table.Column<int>(type: "int", nullable: true),
                    GMB = table.Column<int>(type: "int", nullable: true),
                    DEF = table.Column<int>(type: "int", nullable: true),
                    FIS = table.Column<int>(type: "int", nullable: true),
                    PEG = table.Column<int>(type: "int", nullable: true),
                    TIR = table.Column<int>(type: "int", nullable: true),
                    ATJ = table.Column<int>(type: "int", nullable: true),
                    REF = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Usuarios", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Grupos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Codigo = table.Column<string>(type: "nvarchar(6)", maxLength: 6, nullable: false),
                    CreadorId = table.Column<int>(type: "int", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Grupos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Grupos_Usuarios_CreadorId",
                        column: x => x.CreadorId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "GrupoUsuarios",
                columns: table => new
                {
                    GrupoId = table.Column<int>(type: "int", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    FechaIngreso = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EsCapitan = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GrupoUsuarios", x => new { x.GrupoId, x.UsuarioId });
                    table.ForeignKey(
                        name: "FK_GrupoUsuarios_Grupos_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GrupoUsuarios_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Partidos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GrupoId = table.Column<int>(type: "int", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    FechaJugado = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Estado = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Partidos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Partidos_Grupos_GrupoId",
                        column: x => x.GrupoId,
                        principalTable: "Grupos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PartidoJugadores",
                columns: table => new
                {
                    PartidoId = table.Column<int>(type: "int", nullable: false),
                    UsuarioId = table.Column<int>(type: "int", nullable: false),
                    EquipoAsignado = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FechaConfirmacion = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PartidoJugadores", x => new { x.PartidoId, x.UsuarioId });
                    table.ForeignKey(
                        name: "FK_PartidoJugadores_Partidos_PartidoId",
                        column: x => x.PartidoId,
                        principalTable: "Partidos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PartidoJugadores_Usuarios_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Grupos_Codigo",
                table: "Grupos",
                column: "Codigo",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Grupos_CreadorId",
                table: "Grupos",
                column: "CreadorId");

            migrationBuilder.CreateIndex(
                name: "IX_GrupoUsuarios_UsuarioId",
                table: "GrupoUsuarios",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_PartidoJugadores_UsuarioId",
                table: "PartidoJugadores",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Partidos_GrupoId",
                table: "Partidos",
                column: "GrupoId");

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_Email",
                table: "Usuarios",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_NombreUsuario",
                table: "Usuarios",
                column: "NombreUsuario",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GrupoUsuarios");

            migrationBuilder.DropTable(
                name: "PartidoJugadores");

            migrationBuilder.DropTable(
                name: "Partidos");

            migrationBuilder.DropTable(
                name: "Grupos");

            migrationBuilder.DropTable(
                name: "Usuarios");

            migrationBuilder.CreateTable(
                name: "Jugadores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Calificacion = table.Column<string>(type: "nvarchar(1)", maxLength: 1, nullable: false),
                    Nombre = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Posicion = table.Column<string>(type: "nvarchar(3)", maxLength: 3, nullable: false),
                    PuntajeTotal = table.Column<decimal>(type: "decimal(4,2)", nullable: false),
                    AGT = table.Column<int>(type: "int", nullable: true),
                    ATJ = table.Column<int>(type: "int", nullable: true),
                    DEF = table.Column<int>(type: "int", nullable: true),
                    FIS = table.Column<int>(type: "int", nullable: true),
                    GMB = table.Column<int>(type: "int", nullable: true),
                    PAS = table.Column<int>(type: "int", nullable: true),
                    PEG = table.Column<int>(type: "int", nullable: true),
                    REF = table.Column<int>(type: "int", nullable: true),
                    TIR = table.Column<int>(type: "int", nullable: true),
                    VEL = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jugadores", x => x.Id);
                });
        }
    }
}
