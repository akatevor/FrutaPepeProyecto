import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getfruta } from '../../api/fruta';
import { useAuth } from '../../components/AuthContext';
import './Details.css';

export default function Detailsfruta() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const userRole = user?.role ?? 'EMPLEADO';

    const [gpu, setfruta] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGPU() {
            console.log("[DetailsGPU] Llamando getfruta con id:", id);
            try {
                const data = await getfruta(id);
                console.log("[Detailsfruta] fruta recibida:", data);
                setfruta(data);
            } catch (err) {
                console.error('[Detailsfruta] Error cargando fruta:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchGPU();
    }, [id]);

    if (loading) return <div>Cargando...</div>;
    if (!fruta) return <div>fruta no encontrada</div>;

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6 text-center mb-4">
                    <img 
                        src={fruta.imagen || '/placeholder.png'} 
                        alt={fruta.modelo || 'fruta'} 
                        className="img-fluid rounded shadow" 
                        style={{ maxHeight: '350px', objectFit: 'cover' }} 
                    />
                </div>

                <div className="col-md-6">
                    <h2 className="mb-3">{fruta.modelo || 'Desconocido'}</h2>
                    <ul className="list-group mb-3">
                        <li className="list-group-item"><strong>Tipo:</strong> {fruta.tipo || 'N/A'}</li>
                        <li className="list-group-item"><strong>color:</strong> {fruta.color || 'N/A'}</li>
                        <li className="list-group-item"><strong>Es tropical:</strong> {fruta.es_tropical ?? 'N/A'}</li>
                       
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

                    <button className="btn btn-secondary mb-2" onClick={() => navigate('/fruta')}>Volver a la lista</button>

                    <div className="d-flex gap-2">
                        {(userRole === 'ADMIN' || userRole === 'ENCARGADO') && (
                            <button className="btn btn-warning flex-grow-1" onClick={() => navigate(`/fruta/edit/${fruta.idfruta}`)}>Editar</button>
                        )}
                        {userRole === 'ADMIN' && (
                            <button className="btn btn-danger flex-grow-1" onClick={() => navigate(`/fruta/delete/${fruta.idfruta}`)}>Borrar</button>
                        )}
                    </div>

                    {(userRole === 'ADMIN' || userRole === 'ENCARGADO') && (
                        <button 
                            className="btn btn-success flex-grow-1 mt-2"
                            onClick={() => window.open(`/api/export/fruta/${fruta.idfruta}/excel`, '_blank')}
                        >
                            Exportar a Excel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
