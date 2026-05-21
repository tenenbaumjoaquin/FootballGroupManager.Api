using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootballGroupManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAvatar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Avatar_Vello",
                table: "Usuarios",
                newName: "Avatar_Nariz");

            migrationBuilder.RenameColumn(
                name: "Avatar_ColorVello",
                table: "Usuarios",
                newName: "Avatar_ColorBarba");

            migrationBuilder.RenameColumn(
                name: "Avatar_Cabeza",
                table: "Usuarios",
                newName: "Avatar_Boca");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_Barba",
                table: "Usuarios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Avatar_Barba",
                table: "Usuarios");

            migrationBuilder.RenameColumn(
                name: "Avatar_Nariz",
                table: "Usuarios",
                newName: "Avatar_Vello");

            migrationBuilder.RenameColumn(
                name: "Avatar_ColorBarba",
                table: "Usuarios",
                newName: "Avatar_ColorVello");

            migrationBuilder.RenameColumn(
                name: "Avatar_Boca",
                table: "Usuarios",
                newName: "Avatar_Cabeza");
        }
    }
}
