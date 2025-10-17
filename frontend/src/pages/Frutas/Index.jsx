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
                console.log('[FrutaIndex] Datos recibidos (raw):', data);

                // Inspeccionar forma y normalizar campos esperados
                const normalized = (Array.isArray(data) ? data : []).map((f, i) => {
                    // Log keys for first few items to help debugging
                    if (i < 3) console.log(`[FrutaIndex] item[${i}] keys:`, Object.keys(f || {}));

                        // Backend base URL for images (adjust if backend runs on different host/port)
                        const BACKEND_ORIGIN = 'http://localhost:5157';

                        // Resolve image URL: if backend returns just a filename or relative path,
                        // prefix it with the backend origin so the browser can fetch it.
                        let imagenRaw = f?.imagen ?? f?.Imagen ?? f?.imagenUrl ?? '';
                        let imagenUrl = '';
                        if (imagenRaw) {
                            // If it's already absolute (http/https), use as-is
                            if (/^https?:\/\//i.test(imagenRaw)) {
                                imagenUrl = imagenRaw;
                            } else if (imagenRaw.startsWith('/')) {
                                // Absolute path on backend
                                imagenUrl = `${BACKEND_ORIGIN}${imagenRaw}`;
                            } else {
                                // Filename or relative path stored in DB
                                imagenUrl = `${BACKEND_ORIGIN}/${imagenRaw}`;
                            }
                        }

                        return {
                            idFruta: f?.idFruta ?? f?.IdFruta ?? f?.id ?? null,
                            nombre: f?.nombre ?? f?.Nombre ?? f?.nombreCompleto ?? '',
                            tipo: f?.tipo ?? f?.Tipo ?? '',
                            color: f?.color ?? f?.Color ?? '',
                            esTropical: f?.esTropical ?? f?.EsTropical ?? false,
                            imagen: imagenUrl || '/placeholder.png',
                            precio: (() => {
                                const p = f?.precio ?? f?.Precio ?? f?.price ?? null;
                                const n = typeof p === 'string' ? parseFloat(p.replace(/[^0-9.-]+/g, '')) : p;
                                return Number.isFinite(n) ? n : null;
                            })(),
                            proveedor: f?.proveedor ?? f?.Proveedor ?? null,
                            raw: f,
                        };
                });

                console.log('[FrutaIndex] Datos normalizados (primeros 5):', normalized.slice(0, 5));
                setFrutas(normalized);
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
                                crossOrigin="anonymous"
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
