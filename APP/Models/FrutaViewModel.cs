namespace APP.Models
{
    public class Fruta
    {
        public int IdFruta { get; set; }
        public string Nombre { get; set; }
        public string Tipo { get; set; }
        public string Color { get; set; }
        public bool EsTropical { get; set; }
        public string Imagen { get; set; }
        public decimal Precio { get; set; }

        public int ProveedoresIdProveedor { get; set; }
        public Proveedor Proveedor { get; set; }  // Relación con el proveedor
    }
}
