using FootballGroupManager.Domain.DomainExceptions;
using System.Net;
using System.Text.Json;

namespace FootballGroupManager.Api.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlingMiddleware> _logger;

        public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (DomainException ex)
            {
                _logger.LogWarning("Error de dominio: {Message}", ex.Message);
                await EscribirRespuesta(context, HttpStatusCode.BadRequest, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error inesperado");
                await EscribirRespuesta(context, HttpStatusCode.InternalServerError,
                    "Ocurrió un error inesperado. Intentá de nuevo más tarde.");
            }
        }

        private static async Task EscribirRespuesta(HttpContext context, HttpStatusCode statusCode, string mensaje)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            var respuesta = new
            {
                status = (int)statusCode,
                error = statusCode.ToString(),
                mensaje
            };

            var json = JsonSerializer.Serialize(respuesta, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);
        }
    }
}