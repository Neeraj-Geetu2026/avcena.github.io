var builder = WebApplication.CreateBuilder(args);

var configuredHosts = builder.Configuration["AllowedHosts"]?.Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries) ?? [];
if (builder.Environment.IsProduction() && configuredHosts.All(host => host is "localhost" or "127.0.0.1"))
{
	throw new InvalidOperationException("Configure AllowedHosts with the deployed API hostname before running in production.");
}

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("PublicApi", policy =>
{
	if (allowedOrigins.Length > 0) policy.WithOrigins(allowedOrigins);
	policy.WithHeaders("Content-Type", "Authorization", "X-Request-ID")
		.WithMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS");
}));

var app = builder.Build();

app.Use(async (context, next) =>
{
	context.Response.Headers["X-Content-Type-Options"] = "nosniff";
	context.Response.Headers["X-Frame-Options"] = "DENY";
	context.Response.Headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
	await next();
});

app.UseExceptionHandler(errorApp => errorApp.Run(async context =>
{
	var exception = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;
	var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
	logger.LogError(exception, "Unhandled API exception for {Path}", context.Request.Path);
	context.Response.StatusCode = StatusCodes.Status500InternalServerError;
	await context.Response.WriteAsJsonAsync(new
	{
		type = "Error",
		message = "Something went wrong. Please try again later."
	});
}));
app.UseCors("PublicApi");

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();

public partial class Program;
