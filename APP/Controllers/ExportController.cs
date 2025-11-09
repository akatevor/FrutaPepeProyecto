using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using APP.Filters;
using APP.Services;
using System.Collections.Generic;
using System.Linq;
using System;

namespace APP.Controllers
{
    [ApiController]
    [Route("api/export")]
    [AuthorizeSession("ADMIN", "ENCARGADO")] // Solo roles con permiso
    public class FrutaExportController : ControllerBase
    {
        private readonly ConexionMySql _db;
        private readonly IExcelExportService _excelExportService;

        public FrutaExportController(ConexionMySql db, IExcelExportService excelExportService)
        {
            _db = db;
            _excelExportService = excelExportService;
        }

        // --- Exportar todas las frutas a Excel ---
        [HttpGet("frutas/excel")]
        public IActionResult ExportFrutasToExcel()
        {
            var frutas = _db.ObtenerFrutas();

            if (frutas == null || !frutas.Any())
                return NotFound(new { error = "No se encontraron frutas para exportar." });

            var excelData = _excelExportService.ExportFrutasToExcel(frutas);

            return File(excelData,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"Frutas_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }

        // --- Exportar fruta individual a Excel ---
        [HttpGet("fruta/{id}/excel")]
        public IActionResult ExportSingleFrutaToExcel(int id)
        {
            var fruta = _db.ObtenerFrutas().FirstOrDefault(f => f.IdFruta == id);

            if (fruta == null)
                return NotFound(new { error = "Fruta no encontrada." });

            var excelData = _excelExportService.ExportFrutasToExcel(new List<Fruta> { fruta });

            return File(excelData,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"Fruta_{fruta.Nombre}_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
        }
    }
}
