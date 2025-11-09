// CreateFruta.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProveedores, createFruta } from '../../api/frutas';
import './Create.css';

export default function CreateFruta() {
    const navigate = useNavigate();

    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState({
        Nombre: '',
        Tipo: '',
        Color: '',
        Precio: '',
        Stock: '',
        Imagen: '',
        ProveedoresIdProveedor: 0,
        nuevoProveedorNombre: '',
        nuevoProveedorDireccion: '',
        nuevoProveedorTelefono: '',
        nuevoProveedorEmail: ''
    });

    const [errors, setErrors] = useState([]);

    useEffect(() => {
        async function fetchProveedores() {
            try {
                const data = await getProveedores();
                setProveedores(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error al cargar proveedores:", err);
                setProveedores([]);
            }
        }
        fetchProveedores();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);

        try {
            if (!form.Nombre.trim() || !form.Tipo.trim() || !form.Color.trim()) {
                setErrors(["Nombre, Tipo y Color son obligatorios."]);
                return;
            }

            const frutaPayload = {
                Nombre: form.Nombre.trim(),
                Tipo: form.Tipo.trim(),
                Color: form.Color.trim(),
                Precio: parseFloat(form.Precio) || 0,
                Stock: Number(form.Stock) || 0,
                Imagen: form.Imagen ? form.Imagen.trim() : "",
                ProveedoresIdProveedor: Number(form.ProveedoresIdProveedor) || 0
            };

            const proveedorPayload =
                form.nuevoProveedorNombre && form.nuevoProveedorNombre.trim() !== ""
                    ? {
                        Nombre: form.nuevoProveedorNombre.trim(),
                        Direccion: form.nuevoProveedorDireccion?.trim() || "",
                        Telefono: form.nuevoProveedorTelefono?.trim() || "",
                        Email: form.nuevoProveedorEmail?.trim() || ""
                    }
                    : null;

            await createFruta(frutaPayload, proveedorPayload);
            navigate('/frutas');
        } catch (err) {
            console.error("Error createFruta:", err);
            const msg = (err.body && (err.body.error || err.body.message)) || err.message || "Error desconocido";
            setErrors(Array.isArray(msg) ? msg : [msg]);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Añadir Fruta</h2>

            {errors.length > 0 && (
                <div className="alert alert-danger">
                    {errors.map((err, idx) => <div key={idx}>{err}</div>)}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row g-3">

                    <div className="col-md-4">
                        <label className="form-label">Nombre</label>
                        <input type="text" name="Nombre" className="form-control" value={form.Nombre} onChange={handleChange} required />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Tipo</label>
                        <input type="text" name="Tipo" className="form-control" value={form.Tipo} onChange={handleChange} required />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Color</label>
                        <input type="text" name="Color" className="form-control" value={form.Color} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Precio</label>
                        <input type="number" step="0.01" name="Precio" className="form-control" value={form.Precio} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Stock</label>
                        <input type="number" name="Stock" className="form-control" value={form.Stock} onChange={handleChange} required />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">URL Imagen</label>
                        <input type="text" name="Imagen" className="form-control" value={form.Imagen} onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Proveedor existente (opcional)</label>
                        <select name="ProveedoresIdProveedor" className="form-select" value={form.ProveedoresIdProveedor} onChange={handleChange}>
                            <option value={0}>-- Seleccionar proveedor existente --</option>
                            {proveedores.map(p => (
                                <option key={p.IdProveedor ?? p.id} value={p.IdProveedor ?? p.id}>{p.Nombre ?? p.nombre}</option>
                            ))}
                        </select>
                        <small className="text-muted">Opcional: selecciona un proveedor existente o crea uno nuevo abajo</small>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Crear nuevo proveedor (opcional)</label>
                        <input type="text" name="nuevoProveedorNombre" placeholder="Nombre *" className="form-control mb-1" value={form.nuevoProveedorNombre} onChange={handleChange} />
                        <input type="text" name="nuevoProveedorDireccion" placeholder="Dirección" className="form-control mb-1" value={form.nuevoProveedorDireccion} onChange={handleChange} />
                        <input type="text" name="nuevoProveedorTelefono" placeholder="Teléfono" className="form-control mb-1" value={form.nuevoProveedorTelefono} onChange={handleChange} />
                        <input type="email" name="nuevoProveedorEmail" placeholder="Email" className="form-control" value={form.nuevoProveedorEmail} onChange={handleChange} />
                        <small className="text-muted">Si completas el nombre, se creará un proveedor nuevo</small>
                    </div>

                    <div className="col-12 mt-3">
                        <button type="submit" className="btn btn-success w-100">Añadir Fruta</button>
                    </div>

                    <div className="col-12 mt-2">
                        <button type="button" className="btn btn-secondary w-100" onClick={() => navigate('/frutas')}>Cancelar</button>
                    </div>
                </div>
            </form>
        </div>
    );
}
