import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFruta, updateFruta, getProveedores } from '../../api/frutas';
import './Edit.css';

export default function EditFruta() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado inicial para los inputs controlados
    const [fruta, setFruta] = useState({
        IdFruta: id ? Number(id) : 0,
        Nombre: '',
        Tipo: '',
        Color: '',
        Precio: '',
        Stock: '',
        Imagen: '',
        ProveedoresIdProveedor: ''
    });

    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [frutaData, proveedoresData] = await Promise.all([
                    getFruta(id),
                    getProveedores()
                ]);

                // Mapeo tolerante (por si los nombres de las claves cambian)
                const get = (obj, ...keys) => {
                    for (const k of keys) {
                        if (obj && Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
                    }
                    return undefined;
                };

                const mapped = {
                    IdFruta: get(frutaData, 'IdFruta', 'idFruta', 'id') ?? Number(id),
                    Nombre: get(frutaData, 'Nombre', 'nombre') ?? '',
                    Tipo: get(frutaData, 'Tipo', 'tipo') ?? '',
                    Color: get(frutaData, 'Color', 'color') ?? '',
                    Precio:
                        get(frutaData, 'Precio', 'precio') != null
                            ? String(get(frutaData, 'Precio', 'precio'))
                            : '',
                    Stock:
                        get(frutaData, 'Stock', 'stock') != null
                            ? String(get(frutaData, 'Stock', 'stock'))
                            : '',
                    Imagen: get(frutaData, 'Imagen', 'imagen') ?? '',
                    ProveedoresIdProveedor:
                        get(frutaData?.Proveedor, 'IdProveedor', 'id') ??
                        get(frutaData, 'ProveedoresIdProveedor', 'proveedoresIdProveedor') ??
                        ''
                };

                setFruta(prev => ({ ...prev, ...mapped }));
                setProveedores(Array.isArray(proveedoresData) ? proveedoresData : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFruta(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrors({});

            // Validaciones básicas
            const errores = [];
            if (!fruta.Nombre.trim()) errores.push('El nombre es obligatorio.');
            if (!fruta.Tipo.trim()) errores.push('El tipo es obligatorio.');
            if (!fruta.Color.trim()) errores.push('El color es obligatorio.');

            const precio = parseFloat(fruta.Precio);
            const stock = parseInt(fruta.Stock, 10);

            if (!Number.isFinite(precio) || precio <= 0) errores.push('El precio debe ser mayor que 0.');
            if (!Number.isFinite(stock) || stock < 0) errores.push('El stock no puede ser negativo.');

            if (errores.length > 0) {
                setErrors({ form: errores.join(' ') });
                return;
            }

            // Construir objeto para el backend
            const frutaToSend = {
                IdFruta: Number(fruta.IdFruta),
                Nombre: fruta.Nombre.trim(),
                Tipo: fruta.Tipo.trim(),
                Color: fruta.Color.trim(),
                Precio: precio,
                Stock: stock,
                Imagen: fruta.Imagen ? fruta.Imagen.trim() : '',
                ProveedoresIdProveedor: fruta.ProveedoresIdProveedor ? Number(fruta.ProveedoresIdProveedor) : 0
            };

            await updateFruta(id, frutaToSend, null);
            navigate(`/frutas/details/${id}`);
        } catch (err) {
            console.error(err);
            setErrors({ form: 'Error al guardar los cambios.' });
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (!fruta) return <div>Fruta no encontrada.</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Editar Fruta: {fruta.Nombre}</h2>

            {errors.form && <div className="alert alert-danger">{errors.form}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                        type="text"
                        name="Nombre"
                        value={fruta.Nombre ?? ''}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Tipo</label>
                    <input
                        type="text"
                        name="Tipo"
                        value={fruta.Tipo ?? ''}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Color</label>
                    <input
                        type="text"
                        name="Color"
                        value={fruta.Color ?? ''}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                        type="number"
                        name="Precio"
                        value={fruta.Precio ?? ''}
                        step="0.01"
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                        type="number"
                        name="Stock"
                        value={fruta.Stock ?? ''}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Proveedor</label>
                    <select
                        name="ProveedoresIdProveedor"
                        value={String(fruta.ProveedoresIdProveedor ?? '')}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="">-- Seleccione un proveedor --</option>
                        {proveedores.map(p => (
                            <option key={p.IdProveedor ?? p.id} value={p.IdProveedor ?? p.id}>
                                {p.Nombre ?? p.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">URL de Imagen</label>
                    <input
                        type="text"
                        name="Imagen"
                        value={fruta.Imagen ?? ''}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-warning">Guardar cambios</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate(`/frutas/details/${fruta.IdFruta}`)}>
                    Cancelar
                </button>
            </form>
        </div>
    );
}
