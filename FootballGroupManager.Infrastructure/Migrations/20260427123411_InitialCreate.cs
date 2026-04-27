using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootballGroupManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Jugadores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
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
                    table.PrimaryKey("PK_Jugadores", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Jugadores");
        }
    }
}
