using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using APP.Filters;
using APP.Services;
using System;
using System.Collections.Generic;
using System.Linq;

[ApiController]
[Route("api/export")]
[AuthorizeSession("ADMIN", "ENCARGADO")]
public class FrutaExportController : ControllerBase
{
    private readonly ConexionMySql _db;
    private readonly IExcelExportService _excelExportService;

    public FrutaExportController(ConexionMySql db, IExcelExportService excelExportService)
    {
        _db = db;
        _excelExportService = excelExportService;
    }

    // Exportar todas las frutas
    [HttpGet("frutas/excel")]
    public IActionResult ExportFrutasToExcel()
    {
        var frutas = _db.ObtenerFrutas();
        if (frutas == null || !frutas.Any())
            return NotFound("No se encontraron frutas para exportar.");

        // Llama al método de tu servicio que maneja Fruta
        var excelData = _excelExportService.ExportFrutasToExcel(frutas);

        var fileName = $"Frutas_{DateTime.Now:yyyyMMddHHmmss}.xlsx";
        return File(
            excelData,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileName
        );
    }

    // Exportar una fruta en concreto
    [HttpGet("fruta/{id}/excel")]
    public IActionResult ExportSingleFrutaToExcel(int id)
    {
        var fruta = _db.ObtenerFrutas().FirstOrDefault(f => f.IdFruta == id);
        if (fruta == null)
            return NotFound("Fruta no encontrada.");

        var excelData = _excelExportService.ExportFrutasToExcel(new List<Fruta> { fruta });
        var safeName = fruta.Nombre.Replace(" ", "_");
        var fileName = $"Fruta_{safeName}_{DateTime.Now:yyyyMMddHHmmss}.xlsx";

        return File(
            excelData,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            fileName
        );
    }
}
