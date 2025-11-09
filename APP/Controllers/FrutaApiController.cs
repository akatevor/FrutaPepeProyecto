using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Text.Json;

namespace APP.Controllers
{
    [Route("api/fruta")]
    [ApiController]
    [Authorize] // Requiere JWT
    public class FrutaApiController : ControllerBase
    {
        private readonly ConexionMySql _db;

        public FrutaApiController(ConexionMySql db)
        {
            _db = db;
        }

        // DTO para recibir Fruta + proveedor opcional
        public class FrutaCreateEditDTO
        {
            public Fruta Fruta { get; set; }
            public Proveedor Proveedor { get; set; } // Opcional
        }

        // --- LISTAR TODAS LAS FRUTAS ---
        [HttpGet]
        public IActionResult GetFrutas()
        {
            try
            {
                var lista = _db.ObtenerFrutas() ?? new List<Fruta>();

                var result = lista.Select(f => new
                {
                    f.IdFruta,
                    f.Nombre,
                    f.Tipo,
                    f.Color,
                    f.EsTropical,
                    f.Precio,
                    f.Imagen,
                    Proveedor = f.Proveedor == null ? null : new
                    {
                        f.Proveedor.IdProveedor,
                        f.Proveedor.Nombre,
                        f.Proveedor.Direccion,
                        f.Proveedor.Telefono,
                        f.Proveedor.Email
                    }
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FrutaApiController] Error en GetFrutas: {ex}");
                return StatusCode(500, new { error = "Error interno al listar frutas" });
            }
        }

        // --- BUSCAR POR NOMBRE ---
        [HttpGet("search")]
        public IActionResult Search([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return BadRequest(new { error = "Debe enviar searchTerm" });

            try
            {
                var lista = _db.ObtenerFrutas() ?? new List<Fruta>();
                var resultados = lista
                    .Where(f => !string.IsNullOrEmpty(f.Nombre) &&
                                f.Nombre.IndexOf(searchTerm, StringComparison.OrdinalIgnoreCase) >= 0)
                    .Select(f => new
                    {
                        f.IdFruta,
                        f.Nombre,
                        f.Tipo,
                        f.Color,
                        f.EsTropical,
                        f.Precio,
                        f.Imagen,
                        Proveedor = f.Proveedor == null ? null : new
                        {
                            f.Proveedor.IdProveedor,
                            f.Proveedor.Nombre
                        }
                    })
                    .ToList();

                if (!resultados.Any())
                    return NotFound(new { error = $"No se encontraron frutas con '{searchTerm}'." });

                return Ok(resultados);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FrutaApiController] Error en Search('{searchTerm}'): {ex}");
                return StatusCode(500, new { error = "Error interno al buscar frutas" });
            }
        }

        // --- OBTENER FRUTA POR ID ---
        [HttpGet("{id}")]
        public IActionResult GetFruta(int id)
        {
            try
            {
                var fruta = _db.ObtenerFrutas()?.FirstOrDefault(f => f.IdFruta == id);

                if (fruta == null) return NotFound(new { error = "Fruta no encontrada" });

                var result = new
                {
                    fruta.IdFruta,
                    fruta.Nombre,
                    fruta.Tipo,
                    fruta.Color,
                    fruta.EsTropical,
                    fruta.Precio,
                    fruta.Imagen,
                    Proveedor = fruta.Proveedor == null ? null : new
                    {
                        IdProveedor = fruta.Proveedor.IdProveedor,
                        Nombre = fruta.Proveedor.Nombre,
                        Direccion = fruta.Proveedor.Direccion,
                        Telefono = fruta.Proveedor.Telefono,
                        Email = fruta.Proveedor.Email
                    }
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FrutaApiController] Error en GetFruta id={id}: {ex}");
                return StatusCode(500, new { error = "Error interno al obtener fruta" });
            }
        }

        // --- UTIL: parsear body robustamente ---
        private bool TryParseDto(JsonElement body, out FrutaCreateEditDTO dto, out string errorMessage)
        {
            dto = null;
            errorMessage = null;
            try
            {
                var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                dto = JsonSerializer.Deserialize<FrutaCreateEditDTO>(body.GetRawText(), opts);

                if (dto == null || dto.Fruta == null)
                {
                    try
                    {
                        var singleFruta = JsonSerializer.Deserialize<Fruta>(body.GetRawText(), opts);
                        if (singleFruta != null)
                        {
                            dto = new FrutaCreateEditDTO { Fruta = singleFruta, Proveedor = null };
                        }
                    }
                    catch { }
                }

                if (dto == null || dto.Fruta == null)
                {
                    errorMessage = "No se encontró un objeto Fruta válido en el body.";
                    return false;
                }

                return true;
            }
            catch (JsonException jex)
            {
                errorMessage = "JSON inválido: " + jex.Message;
                return false;
            }
            catch (Exception ex)
            {
                errorMessage = "Error al procesar body: " + ex.Message;
                return false;
            }
        }

        // --- CREAR FRUTA (solo ADMIN y ENCARGADO) ---
        [HttpPost]
        [Authorize(Roles = "ADMIN,ENCARGADO")]
        public IActionResult Create([FromBody] JsonElement body)
        {
            try
            {
                if (!TryParseDto(body, out var dto, out var parseError))
                    return BadRequest(new { error = parseError ?? "Body inválido" });

                var fruta = dto.Fruta;
                var proveedor = dto.Proveedor;

                var errores = new List<string>();
                if (string.IsNullOrWhiteSpace(fruta.Nombre)) errores.Add("Nombre es obligatorio.");
                if (string.IsNullOrWhiteSpace(fruta.Tipo)) errores.Add("Tipo es obligatorio.");
                if (fruta.Precio <= 0) errores.Add("Precio debe ser mayor que 0.");

                if (errores.Any())
                    return BadRequest(new { error = "Campos obligatorios incompletos", details = errores });

                fruta.Imagen = fruta.Imagen ?? string.Empty;

                bool resultado = _db.InsertarFruta(fruta, proveedor);

                if (!resultado)
                    return StatusCode(500, new { error = "No se pudo insertar la fruta" });

                var bodyResult = new
                {
                    fruta.IdFruta,
                    fruta.Nombre,
                    fruta.Tipo,
                    fruta.Color,
                    fruta.EsTropical,
                    fruta.Precio,
                    fruta.Imagen,
                    Proveedor = proveedor == null ? null : new
                    {
                        proveedor.IdProveedor,
                        proveedor.Nombre
                    }
                };

                if (fruta.IdFruta > 0)
                    return CreatedAtAction(nameof(GetFruta), new { id = fruta.IdFruta }, bodyResult);

                return Ok(bodyResult);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FrutaApiController] Error en Create: {ex}");
                return StatusCode(500, new { error = "Error interno al crear fruta" });
            }
        }

        // --- EDITAR FRUTA (solo ADMIN y ENCARGADO) ---
        [HttpPut("{id}")]
        [Authorize(Roles = "ADMIN,ENCARGADO")]
        public IActionResult Edit(int id, [FromBody] JsonElement body)
        {
            try
            {
                if (!TryParseDto(body, out var dto, out var parseError))
                    return BadRequest(new { error = parseError ?? "Body inválido" });

                var fruta = dto.Fruta;
                var proveedor = dto.Proveedor;
                fruta.IdFruta = id;

                var errores = new List<string>();
                if (string.IsNullOrWhiteSpace(fruta.Nombre)) errores.Add("Nombre es obligatorio.");
                if (string.IsNullOrWhiteSpace(fruta.Tipo)) errores.Add("Tipo es obligatorio.");
                if (fruta.Precio <= 0) errores.Add("Precio debe ser mayor que 0.");

                if (errores.Any())
                    return BadRequest(new { error = "Campos obligatorios incompletos", details = errores });

                bool actualizado = _db.EditarFruta(fruta, proveedor);

                if (!actualizado)
                    return StatusCode(500, new { error = "No se pudo actualizar la fruta" });

                var bodyResult = new
                {
                    fruta.IdFruta,
                    fruta.Nombre,
                    fruta.Tipo,
                    fruta.Color,
                    fruta.EsTropical,
                    fruta.Precio,
                    fruta.Imagen,
                    Proveedor = proveedor == null ? null : new
                    {
                        proveedor.IdProveedor,
                        proveedor.Nombre
                    }
                };

                return Ok(bodyResult);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FrutaApiController] Error en Edit id={id}: {ex}");
                return StatusCode(500, new { error = "Error interno al editar fruta" });
            }
        }

        // --- ELIMINAR FRUTA (solo ADMIN) ---
        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public IActionResult Delete(int id)
        {
            try
            {
                bool eliminado = _db.EliminarFruta(id);
                if (!eliminado)
                    return StatusCode(500, new { error = "No se pudo eliminar la fruta" });

                return Ok(new { message = "Fruta eliminada" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[FrutaApiController] Error en Delete id={id}: {ex}");
                return StatusCode(500, new { error = "Error interno al eliminar fruta" });
            }
        }
    }
}
