using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using APP.Filters;
using System.Linq;
using System.Collections.Generic;

[ApiController]
[Route("api/frutas")]
[Microsoft.AspNetCore.Authorization.AllowAnonymous]
public class FrutaApiController : ControllerBase
{
    private readonly ConexionMySql _db;

    public FrutaApiController(ConexionMySql db)
    {
        _db = db;
    }

    // GET: api/frutas
    [HttpGet]
    public ActionResult<IEnumerable<Fruta>> GetAll()
    {
        var frutas = _db.ObtenerFrutas() ?? new List<Fruta>();
        return Ok(frutas);
    }

    // GET: api/frutas/{id}
    [HttpGet("{id}")]
    public ActionResult<Fruta> GetById(int id)
    {
        var fruta = _db.ObtenerFrutas().FirstOrDefault(f => f.IdFruta == id);
        if (fruta == null) return NotFound(new { message = "Fruta no encontrada" });
        return Ok(fruta);
    }

    // GET: api/frutas/search?searchTerm=xxx
    [HttpGet("search")]
    public ActionResult<IEnumerable<Fruta>> Search([FromQuery] string searchTerm)
    {
        if (string.IsNullOrWhiteSpace(searchTerm))
            return Ok(_db.ObtenerFrutas() ?? new List<Fruta>());

        var term = searchTerm.ToLower();
        var resultados = (_db.ObtenerFrutas() ?? new List<Fruta>())
            .Where(f => !string.IsNullOrEmpty(f.Nombre) && f.Nombre.ToLower().Contains(term))
            .ToList();

        if (!resultados.Any()) return NotFound(new { message = "No se encontraron frutas" });
        return Ok(resultados);
    }
}
