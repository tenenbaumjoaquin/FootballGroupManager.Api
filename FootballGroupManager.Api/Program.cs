using FootballGroupManager.Application.Interfaces;
using FootballGroupManager.Application.Services.Jugadores;
using FootballGroupManager.Infrastructure.Repositories;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IJugadorRepository, InMemoryJugadorRepository>();
builder.Services.AddScoped<IJugadorService, JugadorService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<JugadorService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();