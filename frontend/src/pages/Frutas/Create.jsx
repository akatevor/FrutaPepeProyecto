import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProveedores } from '../../api/frutas';
import { createFruta } from '../../api/frutas';
import './Create.css';

export default function CreateFruta() {
    const navigate = useNavigate();

    const [proveedores, setProveedores] = useState([]);
    const [form, setForm] = useState({
        Nombre: '',
        Tipo: '',
        Color: '',
        Peso: '',           // en kg (opcional)
        EsTropical: false,
        Imagen: '',
        Precio: '',
        ProveedoresIdProveedor: '',

        // campos para crear proveedor nuevo (opcional)
        nuevoProveedorNombre: '',
        nuevoProveedorDireccion: '',
        nuevoProveedorTelefono: '',
        nuevoProveedorEmail: ''
    });

    const [errors, setErrors] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchProveedores() {
            try {
                const data = await getProveedores();
                setProveedores(data || []);
            } catch (err) {
                console.error('[CreateFruta] error cargando proveedores:', err);
                setProveedores([]);
            }
        }
        fetchProveedores();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setSaving(true);

        try {
            // Validaciones básicas
            const errs = [];
            if (!form.Nombre.trim()) errs.push('Nombre es requerido.');
            if (!form.Tipo.trim()) errs.push('Tipo es requerido.');
            if (form.Precio === '' || Number.isNaN(Number(form.Precio))) errs.push('Precio válido es requerido.');

            if (errs.length > 0) {
                setErrors(errs);
                setSaving(false);
                return;
            }

            // Preparar payload: convertir tipos numéricos
            const payload = {
                Nombre: form.Nombre.trim(),
                Tipo: form.Tipo.trim(),
                Color: form.Color?.trim() || null,
                Peso: form.Peso !== '' ? parseFloat(form.Peso) : null,
                EsTropical: !!form.EsTropical,
                Imagen: form.Imagen?.trim() || null,
                Precio: parseFloat(form.Precio),
                ProveedoresIdProveedor: form.ProveedoresIdProveedor || null,
                // si hay datos de nuevo proveedor, agrégalos (backend debe soportarlo)
                NuevoProveedor: form.nuevoProveedorNombre ? {
                    Nombre: form.nuevoProveedorNombre.trim(),
                    Direccion: form.nuevoProveedorDireccion?.trim() || null,
                    Telefono: form.nuevoProveedorTelefono?.trim() || null,
                    Email: form.nuevoProveedorEmail?.trim() || null
                } : null
            };

            // Llamada a la API
            await createFruta(payload);

            // Redirigir al listado de frutas
            navigate('/frutas');
        } catch (err) {
            console.error('[CreateFruta] error al crear fruta:', err);
            // Espera que el backend devuelva { errors: [...] } o mensaje
            if (err?.errors) setErrors(err.errors);
            else setErrors([err.message || 'Error desconocido al crear la fruta.']);
        } finally {
            setSaving(false);
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

                    <div className="col-md-6">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            name="Nombre"
                            className="form-control"
                            value={form.Nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Tipo</label>
                        <input
                            type="text"
                            name="Tipo"
                            className="form-control"
                            value={form.Tipo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Color</label>
                        <input
                            type="text"
                            name="Color"
                            className="form-control"
                            value={form.Color}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Peso (kg)</label>
                        <input
                            type="number"
                            step="0.01"
                            name="Peso"
                            className="form-control"
                            value={form.Peso}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-4 d-flex align-items-center">
                        <div className="form-check mt-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="EsTropical"
                                name="EsTropical"
                                checked={!!form.EsTropical}
                                onChange={handleChange}
                            />
                            <label className="form-check-label" htmlFor="EsTropical">
                                Es tropical
                            </label>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">URL Imagen</label>
                        <input
                            type="text"
                            name="Imagen"
                            className="form-control"
                            value={form.Imagen}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Precio</label>
                        <input
                            type="number"
                            step="0.01"
                            name="Precio"
                            className="form-control"
                            value={form.Precio}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Proveedor existente (opcional)</label>
                        <select
                            name="ProveedoresIdProveedor"
                            className="form-select"
                            value={form.ProveedoresIdProveedor}
                            onChange={handleChange}
                        >
                            <option value="">-- Seleccionar proveedor existente --</option>
                            {proveedores.map(p => (
                                <option key={p.IdProveedor} value={p.IdProveedor}>{p.Nombre}</option>
                            ))}
                        </select>
                        <small className="text-muted">Opcional: selecciona un proveedor existente O crea uno nuevo abajo</small>
                    </div>

                    <div className="col-md-6">
                        <label className="form-label">Crear nuevo proveedor (opcional)</label>
                        <input
                            type="text"
                            name="nuevoProveedorNombre"
                            placeholder="Nombre *"
                            className="form-control mb-1"
                            value={form.nuevoProveedorNombre}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="nuevoProveedorDireccion"
                            placeholder="Dirección"
                            className="form-control mb-1"
                            value={form.nuevoProveedorDireccion}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="nuevoProveedorTelefono"
                            placeholder="Teléfono"
                            className="form-control mb-1"
                            value={form.nuevoProveedorTelefono}
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            name="nuevoProveedorEmail"
                            placeholder="Email"
                            className="form-control"
                            value={form.nuevoProveedorEmail}
                            onChange={handleChange}
                        />
                        <small className="text-muted">Si completas el nombre, se intentará crear un proveedor nuevo</small>
                    </div>

                    <div className="col-12 mt-3">
                        <button type="submit" className="btn btn-success w-100" disabled={saving}>
                            {saving ? 'Guardando...' : 'Añadir Fruta'}
                        </button>
                    </div>

                    <div className="col-12 mt-2">
                        <button type="button" className="btn btn-secondary w-100" onClick={() => navigate('/frutas')}>
                            Cancelar
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}
