import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFrutas } from '../../api/Frutas';
import { useAuth } from '../../components/AuthContext'; // <-- ruta corregida
import './Index.css';

export default function FrutaIndex() {
    const { userRole } = useAuth(); // obtenemos el rol desde el contexto

    const [frutas, setFrutas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                console.log('[FrutaIndex] Llamando a getFrutas...');
                const data = await getFrutas();
                console.log('[FrutaIndex] Datos recibidos:', data);
                setFrutas(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('[FrutaIndex] Error cargando frutas:', err);
                setError('Error cargando frutas desde el servidor.');
            }
        }
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('[FrutaIndex] Buscar fruta:', searchTerm);
        // Aquí puedes agregar búsqueda backend: llamar searchFruta(searchTerm) y setFrutas(resultado)
    };

    // Definimos permisos según rol
    const canCreate = userRole === 'ADMIN' || userRole === 'ENCARGADO';
    const canEdit = userRole === 'ADMIN' || userRole === 'ENCARGADO';
    const canDelete = userRole === 'ADMIN';

    return (
        <div className="container mt-4">

            {/* Botones superiores según rol */}
            <div className="mb-3 d-flex flex-wrap gap-2">
                {userRole === 'ADMIN' && (
                    <Link to="/user/main" className="btn btn-success">Menú Principal</Link>
                )}
                {canCreate && (
                    <Link to="/frutas/create" className="btn btn-primary">Añadir Fruta</Link>
                )}
                {(userRole === 'ADMIN' || userRole === 'ENCARGADO') && (
                    <a href="/api/export/frutas/excel" className="btn btn-success">Exportar a Excel</a>
                )}
            </div>

            {/* Formulario de búsqueda */}
            <form className="row g-3 mb-4" onSubmit={handleSearch}>
                <div className="col-auto">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar fruta..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                    />
                </div>
                <div className="col-auto">
                    <button type="submit" className="btn btn-primary mb-3">Buscar</button>
                </div>
            </form>

            {/* Mensaje de error */}
            {error && <div className="alert alert-warning text-center">{error}</div>}

            {/* Lista de Frutas */}
            <div className="row">
                {frutas.length === 0 && !error && (
                    <div className="col-12 text-center">No hay frutas disponibles.</div>
                )}

                {frutas.map((item, index) => (
                    <div key={item?.idFruta ?? index} className="col-sm-6 col-md-4 col-lg-3 mb-4">
                        <div className="card h-100 shadow-sm">
                            <img
                                src={item?.imagen || '/placeholder.png'}
                                className="card-img-top"
                                alt={item?.nombre || 'Fruta'}
                                style={{ height: '180px', objectFit: 'cover' }}
                            />
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{item?.nombre || 'Desconocido'}</h5>
                                <p className="card-text mb-1">Tipo: {item?.tipo || 'N/A'}</p>
                                <p className="card-text mb-2">Color: {item?.color || 'N/A'}</p>
                                <p className="card-text mb-2">Peso: {item?.peso ? `${item.peso} kg` : 'N/A'}</p>
                                <p className="card-text fw-bold mb-3">
                                    Precio: {item?.precio != null ? 
                                        item.precio.toLocaleString('es-ES', { style: 'currency', currency: 'USD' }) : 
                                        'N/A'}
                                </p>

                                {/* Botones según rol */}
                                <div className="mt-auto d-flex gap-2">
                                    <Link to={`/frutas/details/${item?.idFruta}`} className="btn btn-primary flex-grow-1">Detalles</Link>

                                    {canEdit && (
                                        <Link to={`/frutas/edit/${item?.idFruta}`} className="btn btn-warning flex-grow-1">Editar</Link>
                                    )}

                                    {canDelete && (
                                        <Link to={`/frutas/delete/${item?.idFruta}`} className="btn btn-danger flex-grow-1">Borrar</Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
