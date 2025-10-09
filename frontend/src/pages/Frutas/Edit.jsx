import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFruta, updateFruta, getProveedores } from '../../api/frutas';
import './Edit.css';

export default function EditFruta() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [fruta, setFruta] = useState(null);
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchData() {
            try {
                const [frutaData, proveedoresData] = await Promise.all([
                    getFruta(id),
                    getProveedores()
                ]);
                setFruta(frutaData);
                setProveedores(proveedoresData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFruta(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrors({});
            await updateFruta(id, fruta);
            navigate(`/frutas/details/${id}`);
        } catch (err) {
            console.error(err);
            setErrors({ form: 'Error al guardar los cambios' });
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (!fruta) return <div>Fruta no encontrada</div>;

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
                        value={fruta.Nombre}
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
                        value={fruta.Tipo}
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
                        value={fruta.Color}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Peso (kg)</label>
                    <input
                        type="number"
                        name="Peso"
                        value={fruta.Peso}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Precio (USD)</label>
                    <input
                        type="number"
                        name="Precio"
                        value={fruta.Precio}
                        step="0.01"
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Proveedor</label>
                    <select
                        name="ProveedoresIdProveedor"
                        value={fruta.ProveedoresIdProveedor || ''}
                        onChange={handleChange}
                        className="form-select"
                    >
                        <option value="">-- Seleccione un proveedor --</option>
                        {proveedores.map(p => (
                            <option key={p.IdProveedor} value={p.IdProveedor}>{p.Nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">URL Imagen</label>
                    <input
                        type="text"
                        name="Imagen"
                        value={fruta.Imagen}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <button type="submit" className="btn btn-warning">Guardar cambios</button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate(`/frutas/details/${fruta.IdFruta}`)}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
}
