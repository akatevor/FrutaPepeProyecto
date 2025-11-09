// ...existing code...
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFruta } from '../../api/frutas';
import { useAuth } from '../../components/AuthContext';
import './Details.css';

export default function DetailsFruta() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userRole } = useAuth();
    const role = (userRole || 'EMPLEADO').toUpperCase();

    const [fruta, setFruta] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFruta() {
            try {
                const data = await getFruta(id);
                setFruta(data);
            } catch (err) {
                console.error('[DetailsFruta] Error cargando fruta:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchFruta();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (!fruta) return <div>Fruta no encontrada</div>;

    const canEdit = role === 'ADMIN' || role === 'ENCARGADO';
    const canDelete = role === 'ADMIN';

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 text-center mb-4">
                    <img 
                        src={fruta.imagen || '/placeholder.png'} 
                        alt={fruta.nombre || 'Fruta'} 
                        className="img-fluid rounded shadow" 
                        style={{ maxHeight: '350px', objectFit: 'cover' }} 
                    />
                </div>

                <div className="col-md-6">
                    <h2 className="mb-3">{fruta.nombre || 'Desconocido'}</h2>
                    <ul className="list-group mb-3">
                        <li className="list-group-item"><strong>Tipo:</strong> {fruta.tipo || 'N/A'}</li>
                        <li className="list-group-item"><strong>Color:</strong> {fruta.color || 'N/A'}</li>
                        <li className="list-group-item"><strong>Peso Promedio:</strong> {fruta.pesoPromedio ?? 'N/A'} g</li>
                        <li className="list-group-item"><strong>Precio:</strong> {fruta.precio != null ? fruta.precio.toLocaleString('es-NI', { style: 'currency', currency: 'NIO' }) : 'N/A'}</li>
                        {fruta.proveedor && (
                            <>
                                <li className="list-group-item"><strong>Proveedor:</strong> {fruta.proveedor.nombre}</li>
                                <li className="list-group-item"><strong>Dirección:</strong> {fruta.proveedor.direccion}</li>
                                <li className="list-group-item"><strong>Teléfono:</strong> {fruta.proveedor.telefono}</li>
                                <li className="list-group-item"><strong>Email:</strong> {fruta.proveedor.email}</li>
                            </>
                        )}
                    </ul>

                    <button className="btn btn-secondary mb-2" onClick={() => navigate('/frutas')}>Volver a la lista</button>

                    <div className="d-flex gap-2">
                        {canEdit && (
                            <button className="btn btn-warning flex-grow-1" onClick={() => navigate(`/frutas/edit/${fruta.idFruta}`)}>Editar</button>
                        )}
                        {canDelete && (
                            <button className="btn btn-danger flex-grow-1" onClick={() => navigate(`/frutas/delete/${fruta.idFruta}`)}>Borrar</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
// ...existing code...
