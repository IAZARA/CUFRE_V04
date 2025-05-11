import React from 'react';

const logoMinisterio = '/images/logo ministerio seguridad nacional.png';
const logoCufre = '/images/logo-cufre-2.png';

export interface ModalWantedProps {
  expediente: any;
  open: boolean;
  onClose: () => void;
  onDetalle: () => void;
}

const ModalWanted: React.FC<ModalWantedProps> = ({ expediente, open, onClose, onDetalle }) => {
  if (!open || !expediente) return null;

  // Buscar foto principal
  const fotoPrincipal = expediente.fotografias?.find((f: any) => f.id === expediente.fotoPrincipalId);
  const fotoUrl = fotoPrincipal?.rutaArchivo
    ? (fotoPrincipal.rutaArchivo.startsWith('http')
        ? fotoPrincipal.rutaArchivo
        : `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080'}${fotoPrincipal.rutaArchivo}`)
    : logoCufre;

  // Nombre del prófugo (imputado principal)
  const imputado = expediente.personaExpedientes?.find((p: any) => (p.tipoRelacion || '').toLowerCase() === 'imputado');
  const nombre = imputado && imputado.persona
    ? `${imputado.persona.nombre || ''} ${imputado.persona.apellido || ''}`.trim().toUpperCase()
    : '-';

  // Delitos principales
  const delitos = expediente.delitos && expediente.delitos.length > 0
    ? expediente.delitos.map((d: any) => d.nombre || d.descripcion || '').filter(Boolean)
    : [];

  // Recompensa
  const recompensa = expediente.recompensa;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 2000, paddingTop: 80
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, boxShadow: '0 8px 32px #0008', minWidth: 500, maxWidth: 700, padding: 0, overflow: 'hidden', border: '6px solid #1a237e', position: 'relative', fontFamily: 'sans-serif'
      }}>
        {/* Encabezado */}
        <div style={{ display: 'flex', alignItems: 'center', background: '#1a237e', padding: '18px 18px 10px 18px', borderBottom: '3px solid #1a237e' }}>
          <img src={logoMinisterio} alt="Logo Ministerio" style={{ width: 60, marginRight: 18, borderRadius: 0, border: 'none', background: 'none', boxShadow: 'none' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: 2, fontFamily: 'serif', marginBottom: 2 }}>BUSCADO</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 0 }}>POR EL MINISTERIO DE SEGURIDAD NACIONAL</div>
          </div>
        </div>
        {/* Nombre */}
        <div style={{ fontSize: 32, fontWeight: 900, color: '#1a237e', textAlign: 'center', margin: '28px 0 10px 0', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'serif' }}>{nombre}</div>
        {/* Foto */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 18px 0' }}>
          <img src={fotoUrl} alt="Foto" style={{ width: 220, height: 220, objectFit: 'cover', borderRadius: 12, border: '6px solid #fff', boxShadow: '0 4px 24px #0004', background: '#fff' }} />
        </div>
        {/* Delitos como lista */}
        {delitos.length > 0 && (
          <ul style={{
            fontSize: 18,
            color: '#222',
            fontWeight: 600,
            textAlign: 'center',
            margin: '0 32px 18px 32px',
            lineHeight: 1.5,
            listStyle: 'disc',
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6
          }}>
            {delitos.map((delito: string, idx: number) => (
              <li key={idx} style={{ width: '100%', textAlign: 'left', margin: 0, padding: 0 }}>{delito}</li>
            ))}
          </ul>
        )}
        {/* Recompensa */}
        {recompensa && (
          <div style={{
            background: '#e3e7fd', color: '#b22222', fontWeight: 900, fontSize: 22, textAlign: 'center', borderRadius: 10, padding: '10px 0', margin: '10px 30px', border: '2px solid #1a237e', letterSpacing: 1
          }}>
            RECOMPENSA: ${recompensa}
          </div>
        )}
        {/* Pie */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 18, background: '#e3e7fd', borderTop: '2px solid #1a237e' }}>
          <button onClick={onDetalle} style={{
            background: '#b22222', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '10px 22px', fontSize: 16, cursor: 'pointer', marginRight: 12
          }}>Ver Detalle Completo</button>
          <button onClick={onClose} style={{
            background: '#eee', color: '#333', fontWeight: 500, border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer'
          }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalWanted; 