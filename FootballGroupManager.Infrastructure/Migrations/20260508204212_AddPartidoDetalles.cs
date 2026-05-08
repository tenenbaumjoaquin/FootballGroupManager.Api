using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FootballGroupManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPartidoDetalles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Direccion",
                table: "Partidos",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "FechaHora",
                table: "Partidos",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Latitud",
                table: "Partidos",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Longitud",
                table: "Partidos",
                type: "float",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Direccion",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "FechaHora",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Latitud",
                table: "Partidos");

            migrationBuilder.DropColumn(
                name: "Longitud",
                table: "Partidos");
        }
    }
}
