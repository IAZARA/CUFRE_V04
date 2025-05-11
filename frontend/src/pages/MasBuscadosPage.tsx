import React, { useEffect, useState } from 'react';
import expedienteService from '../api/expedienteService';
import { Expediente } from '../types/expediente.types';
import ModalWanted from '../components/expedientes/ModalWanted';
import { useOutletContext } from 'react-router-dom';
import { useModalContext } from '../context/ModalContext';

// Tipos de expediente (ajusta según tu backend)
// type Expediente = { ... } // Ya importado

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

// Función utilitaria para obtener la URL absoluta de la foto principal
const getFotoUrl = (foto: any) => {
  if (!foto) return '';
  if (foto.rutaArchivo?.startsWith('http')) return foto.rutaArchivo;
  return foto.rutaArchivo
    ? `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080'}${foto.rutaArchivo}`
    : '';
};

// Función para obtener el color según la posición
const getColorByIndex = (index: number) => {
  if (index < 3) return '#e53935'; // rojo
  if (index < 7) return '#fb8c00'; // naranja
  if (index < 10) return '#fbc02d'; // amarillo
  return '#fafafa'; // default
};

const MasBuscadosPage: React.FC = () => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(10);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [expedienteSeleccionado, setExpedienteSeleccionado] = useState<ExpedienteDetalle | null>(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const { masBuscadosModalOpen, setMasBuscadosModalOpen } = useModalContext();
  const [expedienteModal, setExpedienteModal] = useState<Expediente | null>(null);

  // Cargar expedientes al montar o cambiar el límite
  useEffect(() => {
    setLoading(true);
    setError(null);
    expedienteService.getMasBuscados(limit)
      .then(data => setExpedientes(data))
      .catch(() => setError('No se pudieron cargar los más buscados.'))
      .finally(() => setLoading(false));
  }, [limit]);

  // Manejar click en "Ver más"
  const handleVerMas = (id: number) => {
    setLoadingDetalle(true);
    expedienteService.getExpedienteDetalle(id)
      .then(data => setExpedienteSeleccionado(data))
      .catch(() => setError('No se pudo cargar el detalle del expediente.'))
      .finally(() => setLoadingDetalle(false));
  };

  // Al hacer clic en la tarjeta
  const handleCardClick = (exp: Expediente) => {
    setExpedienteModal(exp);
    setMasBuscadosModalOpen(true);
  };

  // Renderizado de expedientes
  const renderExpediente = (exp: Expediente, index: number) => {
    const fotoPrincipal = exp.fotografias?.find(f => f.id === exp.fotoPrincipalId);
    const color = getColorByIndex(index);
    return (
      <div
        key={exp.id}
        className="expediente-card"
        style={{
          border: '1px solid #ddd',
          borderRadius: 18,
          padding: 18,
          margin: 16,
          width: 220,
          minHeight: 260,
          background: color,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          boxShadow: color !== '#fafafa' ? `0 0 12px 2px ${color}55` : undefined,
          cursor: 'pointer'
        }}
        onClick={() => handleCardClick(exp)}
      >
        <div style={{
          position: 'absolute', top: 12, left: 12, fontWeight: 'bold', fontSize: 22, color: '#fff', letterSpacing: 1,
          textShadow: '0 2px 8px #0008', background: '#0007', borderRadius: 8, padding: '2px 12px', minWidth: 32, textAlign: 'left', zIndex: 2
        }}>{index + 1}</div>
        <img
          src={getFotoUrl(fotoPrincipal) || '/img/default.jpg'}
          alt="Foto"
          style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, margin: '32px 0 12px 0', boxShadow: '0 2px 8px #0002' }}
        />
        <h3 style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          textTransform: 'uppercase',
          color: '#111',
          textAlign: 'center',
          letterSpacing: 0.5,
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          maxHeight: 48,
          overflow: 'hidden',
          display: 'block',
          lineHeight: 1.2
        }}>
          {(exp.personaExpedientes?.[0]?.persona?.nombre + ' ' + exp.personaExpedientes?.[0]?.persona?.apellido).toUpperCase()}
        </h3>
      </div>
    );
  };

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
            ? expedientes.map((exp, idx) => renderExpediente(exp, idx))
            : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f5f5f5' }}>
                    <th style={{ textAlign: 'right' }}>Foto</th>
                    <th style={{ textAlign: 'center' }}>Nombre</th>
                    <th style={{ textAlign: 'center' }}>Prioridad</th>
                  </tr>
                </thead>
                <tbody>
                  {expedientes.map((exp, idx) => {
                    const color = getColorByIndex(idx);
                    // Obtener imputado principal
                    const imputado = exp.personaExpedientes?.find(p => (p.tipoRelacion || '').toLowerCase() === 'imputado');
                    const nombreImputado = imputado && imputado.persona ?
                      `${imputado.persona.nombre || ''} ${imputado.persona.apellido || ''}`.trim().toUpperCase() :
                      '-';
                    return (
                      <tr key={exp.id} style={{ borderBottom: '1px solid #eee', background: color }}>
                        <td style={{ textAlign: 'right', verticalAlign: 'middle' }}>
                          <img
                            src={getFotoUrl(exp.fotografias?.find(f => f.id === exp.fotoPrincipalId)) || '/img/default.jpg'}
                            alt="Foto"
                            style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 12, display: 'inline-block' }}
                          />
                        </td>
                        <td style={{ textTransform: 'uppercase', fontWeight: 600, fontSize: 20, textAlign: 'center', verticalAlign: 'middle' }}>{nombreImputado}</td>
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <span style={{ background: '#1976d2', color: '#fff', borderRadius: 12, padding: '2px 14px', fontWeight: 'bold', fontSize: 18, display: 'inline-block' }}>{exp.prioridad}</span>
                          <div style={{ color: '#444', fontSize: 14, marginTop: 2 }}>({idx + 1})</div>
                        </td>
                      </tr>
                    );
                  })}
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
              <img
                src={getFotoUrl(expedienteSeleccionado.fotografias?.find(f => f.id === expedienteSeleccionado.fotoPrincipalId)) || '/img/default.jpg'}
                alt="Foto grande"
                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%', marginBottom: 12 }}
              />
              <h2 style={{ margin: '8px 0' }}>{expedienteSeleccionado.profugoNombreCompleto || expedienteSeleccionado.numero}</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
                {expedienteSeleccionado.delitos && Array.isArray(expedienteSeleccionado.delitos)
                  ? expedienteSeleccionado.delitos.map((d: any) => <li key={d.id || d.nombre}>{d.nombre || d.id}</li>)
                  : null}
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

      {/* Modal Wanted */}
      <ModalWanted
        expediente={expedienteModal}
        open={masBuscadosModalOpen}
        onClose={() => setMasBuscadosModalOpen(false)}
        onDetalle={() => {
          if (expedienteModal) {
            // Navegar a la página de detalle
            window.location.href = `/expedientes/${expedienteModal.id}`;
          }
        }}
      />
    </div>
  );
};

export default MasBuscadosPage; 