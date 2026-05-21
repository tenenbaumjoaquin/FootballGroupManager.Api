using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootballGroupManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAvatar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Avatar_Accesorio",
                table: "Usuarios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_Cabeza",
                table: "Usuarios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_Camiseta",
                table: "Usuarios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_Cara",
                table: "Usuarios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_ColorCamisetaPrincipal",
                table: "Usuarios",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_ColorCamisetaSecundario",
                table: "Usuarios",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_ColorOjos",
                table: "Usuarios",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_ColorPelo",
                table: "Usuarios",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_ColorPiel",
                table: "Usuarios",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_ColorVello",
                table: "Usuarios",
                type: "nvarchar(10)",
                maxLength: 10,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_Fondo",
                table: "Usuarios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_Ojos",
                table: "Usuarios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_Pelo",
                table: "Usuarios",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Avatar_Vello",
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
                name: "Avatar_Accesorio",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_Cabeza",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_Camiseta",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_Cara",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_ColorCamisetaPrincipal",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_ColorCamisetaSecundario",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_ColorOjos",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_ColorPelo",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_ColorPiel",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_ColorVello",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_Fondo",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_Ojos",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_Pelo",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Avatar_Vello",
                table: "Usuarios");
        }
    }
}
