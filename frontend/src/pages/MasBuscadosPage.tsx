import React, { useEffect, useState } from 'react';

// Tipos de expediente (ajusta según tu backend)
type Expediente = {
  id: string;
  nombre: string;
  apellido: string;
  fotoUrl?: string;
  delitosPrincipales: string[];
  prioridad: string | number;
  recompensa?: number;
};

type ExpedienteDetalle = Expediente & {
  // Puedes agregar más campos si el detalle trae más info
  descripcion?: string;
};

// Modal simple (puedes reemplazarlo por uno reutilizable si existe)
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, maxWidth: 500, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 8, right: 8, fontSize: 18, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        {children}
      </div>
    </div>
  );
}

const MasBuscadosPage: React.FC = () => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState<ExpedienteDetalle | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // Cargar expedientes al montar o cambiar el límite
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/expedientes/mas-buscados?limit=${limit}`)
      .then(res => res.ok ? res.json() : Promise.reject('Error al cargar'))
      .then(data => setExpedientes(data))
      .catch(() => setError('No se pudieron cargar los más buscados.'))
      .finally(() => setLoading(false));
  }, [limit]);

  // Manejar click en "Ver más"
  const handleVerMas = (id: string) => {
    setLoadingDetalle(true);
    fetch(`/api/expedientes/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject('Error al cargar detalle'))
      .then(data => setExpedienteSeleccionado(data))
      .catch(() => setError('No se pudo cargar el detalle del expediente.'))
      .finally(() => setLoadingDetalle(false));
  };

  // Renderizado de expedientes
  const renderExpediente = (exp: Expediente) => (
    <div key={exp.id} className="expediente-card" style={{
      border: '1px solid #ddd', borderRadius: 8, padding: 16, margin: 8, minWidth: 220, background: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'
    }}>
      <img src={exp.fotoUrl || '/img/default.jpg'} alt="Foto" style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: '50%', marginBottom: 8 }} />
      <h3 style={{ margin: '8px 0 4px 0' }}>{exp.nombre} {exp.apellido}</h3>
      <p style={{ fontSize: 13, color: '#555', margin: 0 }}>{exp.delitosPrincipales.join(', ')}</p>
      <span style={{
        margin: '8px 0', padding: '2px 8px', borderRadius: 12,
        background: exp.prioridad === 'alta' || exp.prioridad === 1 ? '#e53935' : exp.prioridad === 'media' || exp.prioridad === 2 ? '#ffb300' : '#43a047',
        color: '#fff', fontWeight: 'bold', fontSize: 12
      }}>{exp.prioridad}</span>
      {exp.recompensa && <span style={{ color: '#1565c0', fontWeight: 500, fontSize: 13 }}>Recompensa: ${exp.recompensa}</span>}
      <button onClick={() => handleVerMas(exp.id)} style={{ marginTop: 10, padding: '6px 14px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer' }}>Ver más</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 8 }}>Más Buscados</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <label>
          Mostrar:
          <select value={limit} onChange={e => setLimit(Number(e.target.value))} style={{ marginLeft: 8 }}>
            <option value={10}>10</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </label>
        <button onClick={() => setViewType('grid')} style={{ background: viewType === 'grid' ? '#1976d2' : '#eee', color: viewType === 'grid' ? '#fff' : '#333', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Tarjetas</button>
        <button onClick={() => setViewType('list')} style={{ background: viewType === 'list' ? '#1976d2' : '#eee', color: viewType === 'list' ? '#fff' : '#333', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Lista</button>
      </div>

      {loading && <div style={{ textAlign: 'center', margin: 40 }}><span>Cargando...</span></div>}
      {error && <div style={{ color: 'red', margin: 20 }}>{error}</div>}
      {!loading && !error && expedientes.length === 0 && <div style={{ margin: 20 }}>No hay expedientes para mostrar.</div>}

      {!loading && !error && expedientes.length > 0 && (
        <div style={viewType === 'grid' ? { display: 'flex', flexWrap: 'wrap', gap: 16 } : {}}>
          {viewType === 'grid'
            ? expedientes.map(renderExpediente)
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th>Foto</th>
                    <th>Nombre</th>
                    <th>Delitos</th>
                    <th>Prioridad</th>
                    <th>Recompensa</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {expedientes.map(exp => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td><img src={exp.fotoUrl || '/img/default.jpg'} alt="Foto" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }} /></td>
                      <td>{exp.nombre} {exp.apellido}</td>
                      <td>{exp.delitosPrincipales.join(', ')}</td>
                      <td><span style={{
                        padding: '2px 8px', borderRadius: 12,
                        background: exp.prioridad === 'alta' || exp.prioridad === 1 ? '#e53935' : exp.prioridad === 'media' || exp.prioridad === 2 ? '#ffb300' : '#43a047',
                        color: '#fff', fontWeight: 'bold', fontSize: 12
                      }}>{exp.prioridad}</span></td>
                      <td>{exp.recompensa ? `$${exp.recompensa}` : '-'}</td>
                      <td><button onClick={() => handleVerMas(exp.id)} style={{ padding: '4px 10px', borderRadius: 6, border: 'none', background: '#1976d2', color: '#fff', cursor: 'pointer' }}>Ver más</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>
      )}

      {/* Modal de detalle rápido */}
      {expedienteSeleccionado && (
        <Modal onClose={() => setExpedienteSeleccionado(null)}>
          {loadingDetalle ? (
            <div style={{ textAlign: 'center', margin: 40 }}>Cargando...</div>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <img src="/images/logo%20ministerio%20seguridad%20nacional.png" alt="Logo" style={{ width: 80, marginBottom: 12 }} />
              <img src={expedienteSeleccionado.fotoUrl || '/img/default.jpg'} alt="Foto grande" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%', marginBottom: 12 }} />
              <h2 style={{ margin: '8px 0' }}>{expedienteSeleccionado.nombre} {expedienteSeleccionado.apellido}</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
                {expedienteSeleccionado.delitosPrincipales.map(delito => <li key={delito}>{delito}</li>)}
              </ul>
              {expedienteSeleccionado.recompensa && <p style={{ color: '#1565c0', fontWeight: 500 }}>Recompensa: ${expedienteSeleccionado.recompensa}</p>}
              <button onClick={() => window.location.href = `/expedientes/${expedienteSeleccionado.id}`}
                style={{ marginTop: 16, padding: '8px 18px', borderRadius: 6, border: 'none', background: '#e53935', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                Ver expediente completo
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default MasBuscadosPage; 