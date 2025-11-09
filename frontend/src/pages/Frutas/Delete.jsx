import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteFruta } from '../../api/frutas';

export default function FrutaDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('confirm'); // confirm | loading | done | error
  const [error, setError] = useState(null);

  useEffect(() => {
    async function doDelete() {
      if (!id) {
        setError('ID inválido');
        setStatus('error');
        return;
      }

      const ok = window.confirm('¿Seguro que desea eliminar esta fruta? Esta acción no se puede deshacer.');
      if (!ok) {
        navigate(-1);
        return;
      }

      setStatus('loading');
      try {
        await deleteFruta(id);
        setStatus('done');
        setTimeout(() => navigate('/frutas'), 900);
      } catch (err) {
        console.error('deleteFruta error', err);
        setError(err?.message || 'Error al eliminar la fruta.');
        setStatus('error');
      }
    }

    doDelete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (status === 'confirm') return null;
  if (status === 'loading') return <div className="container mt-4">Eliminando...</div>;
  if (status === 'done') return <div className="container mt-4 alert alert-success">Fruta eliminada. Redirigiendo...</div>;

  return (
    <div className="container mt-4">
      <div className="alert alert-danger">
        <p>Error al eliminar fruta.</p>
        <p>{error}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/frutas')}>Volver a la lista</button>
      </div>
    </div>
  );
}
