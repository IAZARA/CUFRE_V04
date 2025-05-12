import React, { useEffect, useState } from 'react';
import expedienteService from '../api/expedienteService';
import { Expediente } from '../types/expediente.types';
import ModalWanted from '../components/expedientes/ModalWanted';
import { useOutletContext } from 'react-router-dom';
import { useModalContext } from '../context/ModalContext';
import '../styles/MasBuscadosPage.css';
const logoFallback = '/images/logo-cufre-2.png';

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

const getPriorityClass = (priority: number, prefix: string = 'bg') => {
  if (priority === 1) return `${prefix}-danger`;
  if (priority <= 3) return `${prefix}-orange`;
  if (priority <= 10) return `${prefix}-warning`;
  return `${prefix}-navy`;
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

  // --- NUEVA VISTA DE TARJETAS ---
  const TarjetasView = ({ expedientes }: { expedientes: Expediente[] }) => (
    <div className="row g-4">
      {expedientes.map((exp, index) => {
        const fotoPrincipal = exp.fotografias?.find(f => f.id === exp.fotoPrincipalId);
        const nombreCompleto = ((exp.personaExpedientes?.[0]?.persona?.nombre || '') + ' ' + (exp.personaExpedientes?.[0]?.persona?.apellido || '')).trim().toUpperCase() || 'PRÓFUGO NO ESPECIFICADO';
        const priority = index + 1;
        const headerClass = getPriorityClass(priority, 'bg');
        return (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={exp.id}>
            <div
              className={`tarjeta-mas-buscado h-100 shadow-sm`}
              onClick={() => handleCardClick(exp)}
              style={{ cursor: 'pointer' }}
            >
              <div className={`card-header ${headerClass} text-white d-flex justify-content-between align-items-center`}>
                <span>#{priority}</span>
              </div>
              <img
                src={getFotoUrl(fotoPrincipal) || logoFallback}
                alt={`Foto de ${nombreCompleto}`}
                className="tarjeta-imagen-mas-buscado"
                onError={(e) => { (e.target as HTMLImageElement).src = logoFallback; }}
              />
              <div className="card-body d-flex flex-column">
                <h3 className="mb-1 wanted-name">{nombreCompleto}</h3>
                <div className="text-muted small mb-3">Número Legajo: {exp.numero || 'N/A'}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // --- NUEVA VISTA DE LISTA ---
  const ListView = ({ expedientes }: { expedientes: Expediente[] }) => (
    <div>
      {expedientes.map((exp, idx) => {
        const fotoPrincipal = exp.fotografias?.find(f => f.id === exp.fotoPrincipalId);
        const nombreCompleto = ((exp.personaExpedientes?.[0]?.persona?.nombre || '') + ' ' + (exp.personaExpedientes?.[0]?.persona?.apellido || '')).trim().toUpperCase() || 'PRÓFUGO NO ESPECIFICADO';
        const priority = idx + 1;
        const itemClass = getPriorityClass(priority, 'bg');
        return (
          <div
            key={exp.id}
            className={`d-flex justify-content-between align-items-center ${itemClass} mb-2 border rounded p-3 text-white`}
            style={{ cursor: 'pointer' }}
            onClick={() => handleCardClick(exp)}
          >
            <div className="d-flex align-items-center">
              <img
                src={getFotoUrl(fotoPrincipal) || logoFallback}
                alt={`Foto de ${nombreCompleto}`}
                className="imagen-perfil-lista me-3 shadow-sm"
                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: '50%' }}
                onError={(e) => { (e.target as HTMLImageElement).src = logoFallback; }}
              />
              <div>
                <h5 className="mb-1">
                  <span className="badge bg-light text-dark me-2">#{priority}</span>
                  <span className="text-white text-decoration-none">{nombreCompleto}</span>
                </h5>
                <small className="text-white-50">Número Legajo: {exp.numero || 'N/A'}</small>
              </div>
            </div>
            <button className="btn btn-outline-secondary btn-sm">Ver</button>
          </div>
        );
      })}
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
        <div>
          {viewType === 'grid'
            ? <TarjetasView expedientes={expedientes} />
            : <ListView expedientes={expedientes} />}
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