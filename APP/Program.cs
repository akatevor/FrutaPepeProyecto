using APP.Data;
using APP.Services; // Asegúrate de tener esto si usas IExcelExportService
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// ================== Servicios ==================

// MVC con vistas
builder.Services.AddControllersWithViews()
       .AddJsonOptions(options =>
       {
           // Emitir propiedades en camelCase para que coincidan con el frontend JS
           options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
       });

// CORS para desarrollo local (vite dev server)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Servicio de exportación a Excel
builder.Services.AddScoped<IExcelExportService, ExcelExportService>();

// Servicio de acceso a base de datos personalizado
builder.Services.AddScoped<ConexionMySql>();

// Acceso al contexto HTTP (útil para filtros, layouts, etc.)
builder.Services.AddHttpContextAccessor();

// Configuración de sesiones en memoria
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

var app = builder.Build();

// ================== Middleware ==================

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
// Serve static files and add CORS headers for development so images can be loaded by the frontend dev server
app.UseStaticFiles(new Microsoft.AspNetCore.Builder.StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Allow the Vite dev origins (adjust as needed)
        var origin = ctx.Context.Request.Headers["Origin"].ToString();
        if (!string.IsNullOrEmpty(origin) && (origin == "http://localhost:5173" || origin == "http://localhost:5174"))
        {
            ctx.Context.Response.Headers.Append("Access-Control-Allow-Origin", origin);
        }
        else
        {
            // In development allow any origin to simplify static asset loading
            ctx.Context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
        }
    }
});

app.UseRouting();

// Las sesiones deben ir antes de autorización
app.UseSession();

// CORS (solo para desarrollo local)
app.UseCors("AllowLocalDev");

app.UseAuthorization();

// ================== Rutas ==================

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"
);

app.Run();
