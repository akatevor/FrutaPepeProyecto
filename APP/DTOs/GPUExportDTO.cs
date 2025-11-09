// DTOs/FrutaExportDTO.cs
using System;

namespace APP.DTOs
{
    public class FrutaExportDTO
    {
        public int IdFruta { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Tipo { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public bool EsTropical { get; set; }
        public string Imagen { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public ProveedorDTO Proveedor { get; set; } = new ProveedorDTO();
    }

    public class ProveedorDTO
    {
        public int IdProveedor { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Direccion { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
    }
}
