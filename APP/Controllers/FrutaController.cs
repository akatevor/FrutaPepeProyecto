using Microsoft.AspNetCore.Mvc;
using APP.Data;
using APP.Models;
using APP.Filters;
using System;
using System.Collections.Generic;
using System.Linq;

namespace APP.Controllers
{
    [AuthorizeSession("ADMIN", "ENCARGADO", "EMPLEADO")]
    public class FrutaController : Controller
    {
        private readonly ConexionMySql _db;

        public FrutaController(ConexionMySql db)
        {
            _db = db;
        }

        private List<Proveedor> ObtenerProveedores()
        {
            return _db.ObtenerFrutas()
                      .Select(f => f.Proveedor)
                      .Where(p => p != null)
                      .GroupBy(p => p.IdProveedor)
                      .Select(g => g.First())
                      .ToList();
        }

        // --- INDEX (todos los roles pueden)
        public IActionResult Index()
        {
            var lista = _db.ObtenerFrutas() ?? new List<Fruta>();
            if (!lista.Any())
                ViewBag.Error = "No se encontraron frutas.";

            return View(lista);
        }

        [HttpPost]
        public IActionResult Find(string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return RedirectToAction(nameof(Index));

            var lista = _db.ObtenerFrutas();
            var resultados = lista
                .Where(f => !string.IsNullOrEmpty(f.Nombre) &&
                            f.Nombre
                             .ToLower()
                             .Contains(searchTerm.ToLower()))
                .ToList();

            if (!resultados.Any())
                ViewBag.Error = $"No se encontraron frutas con '{searchTerm}'.";

            return View("Index", resultados);
        }

        public IActionResult Details(int id)
        {
            var fruta = _db.ObtenerFrutas()
                           .FirstOrDefault(f => f.IdFruta == id);
            if (fruta == null) 
                return NotFound();

            return View(fruta);
        }

        // --- CREATE (solo ADMIN y ENCARGADO)
        [AuthorizeSession("ADMIN", "ENCARGADO")]
        public IActionResult Create()
        {
            ViewBag.Proveedores = ObtenerProveedores();
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AuthorizeSession("ADMIN", "ENCARGADO")]
        public IActionResult Create(
            Fruta fruta,
            string nuevoProveedorNombre,
            string nuevoProveedorDireccion,
            string nuevoProveedorTelefono,
            string nuevoProveedorEmail)
        {
            bool creandoNuevo = !string.IsNullOrEmpty(nuevoProveedorNombre);

            if (string.IsNullOrEmpty(fruta.Nombre)
                || string.IsNullOrEmpty(fruta.Tipo)
                || string.IsNullOrEmpty(fruta.Color)
                || fruta.Precio <= 0
                || (!creandoNuevo && fruta.ProveedoresIdProveedor <= 0))
            {
                ViewBag.Proveedores = ObtenerProveedores();
                ViewBag.Error = "Por favor complete todos los campos requeridos";
                return View(fruta);
            }

            Proveedor nuevoProveedor = null;
            if (creandoNuevo)
            {
                nuevoProveedor = new Proveedor
                {
                    Nombre = nuevoProveedorNombre,
                    Direccion = nuevoProveedorDireccion,
                    Telefono = nuevoProveedorTelefono,
                    Email = nuevoProveedorEmail
                };
            }

            bool insertado = _db.InsertarFruta(fruta, nuevoProveedor);
            if (insertado)
                return RedirectToAction(nameof(Index));

            ViewBag.Error = "No se pudo insertar la fruta.";
            ViewBag.Proveedores = ObtenerProveedores();
            return View(fruta);
        }

        // --- EDIT (solo ADMIN y ENCARGADO)
        [AuthorizeSession("ADMIN", "ENCARGADO")]
        public IActionResult Edit(int id)
        {
            var fruta = _db.ObtenerFrutas()
                           .FirstOrDefault(f => f.IdFruta == id);
            if (fruta == null) 
                return NotFound();

            ViewBag.Proveedores = ObtenerProveedores();
            return View(fruta);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        [AuthorizeSession("ADMIN", "ENCARGADO")]
        public IActionResult Edit(
            Fruta fruta,
            string nuevoProveedorNombre,
            string nuevoProveedorDireccion,
            string nuevoProveedorTelefono,
            string nuevoProveedorEmail)
        {
            bool creandoNuevo = !string.IsNullOrEmpty(nuevoProveedorNombre);

            if (string.IsNullOrEmpty(fruta.Nombre)
                || string.IsNullOrEmpty(fruta.Tipo)
                || string.IsNullOrEmpty(fruta.Color)
                || fruta.Precio <= 0
                || (!creandoNuevo && fruta.ProveedoresIdProveedor <= 0))
            {
                ViewBag.Proveedores = ObtenerProveedores();
                ViewBag.Error = "Por favor complete todos los campos requeridos";
                return View(fruta);
            }

            Proveedor nuevoProveedor = null;
            if (creandoNuevo)
            {
                nuevoProveedor = new Proveedor
                {
                    Nombre = nuevoProveedorNombre,
                    Direccion = nuevoProveedorDireccion,
                    Telefono = nuevoProveedorTelefono,
                    Email = nuevoProveedorEmail
                };
            }

            bool actualizado = _db.EditarFruta(fruta, nuevoProveedor);
            if (actualizado)
                return RedirectToAction(nameof(Details), new { id = fruta.IdFruta });

            ViewBag.Error = "No se pudo actualizar la fruta.";
            ViewBag.Proveedores = ObtenerProveedores();
            return View(fruta);
        }

        // --- DELETE (solo ADMIN)
        [AuthorizeSession("ADMIN")]
        public IActionResult Delete(int id)
        {
            _db.EliminarFruta(id);
            return RedirectToAction(nameof(Index));
        }
    }
}
