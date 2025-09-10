namespace APP.Models
{
    public class Proveedor
    {
        public int IdProveedor { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Email { get; set; }

        // Relación uno a muchos con Frutas
        public ICollection<Fruta> Frutas { get; set; } = new List<Fruta>();
    }

    public class Fruta
    {
        public int IdFruta { get; set; }
        public string Nombre { get; set; }
        public string Tipo { get; set; }
        public string Color { get; set; }
        public bool EsTropical { get; set; }
        public string Imagen { get; set; }
        public decimal Precio { get; set; }

        // Clave foránea
        public int ProveedoresIdProveedor { get; set; }

        // Propiedad de navegación
        public Proveedor Proveedor { get; set; }
    }
}
