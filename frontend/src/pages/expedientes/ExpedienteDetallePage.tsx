import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Tooltip,
  Dialog,
  DialogContent,
  IconButton
} from '@mui/material';
import expedienteService from '../../api/expedienteService';
import { Expediente, PersonaExpediente, Fotografia } from '../../types/expediente.types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Map as LeafletMap, LatLngBoundsLiteral } from 'leaflet';
import CloseIcon from '@mui/icons-material/Close';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PrintIcon from '@mui/icons-material/Print';

// Mapeo de logos de fuerza
const fuerzaIconos: Record<string, { src: string; alt: string }> = {
  PFA: { src: '/images/icon1.png', alt: 'Policía Federal Argentina' },
  GNA: { src: '/images/Insignia_de_la_Gendarmería_de_Argentina.svg.png', alt: 'Gendarmería Nacional Argentina' },
  PNA: { src: '/images/icon3.png', alt: 'Prefectura Naval Argentina' },
  PSA: { src: '/images/icon4.png', alt: 'Policía de Seguridad Aeroportuaria' },
  INTERPOOL: { src: '/images/interpol.png', alt: 'Interpol' },
  SPF: { src: '/images/Logo_SPF.png', alt: 'Servicio Penitenciario Federal' },
  CUFRE: { src: '/images/logo-cufre-2.png', alt: 'CUFRE' },
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Box sx={{ mb: 3 }}>
    <Paper sx={{
      width: '100%',
      bgcolor: '#002856',
      color: '#fff',
      borderRadius: 2,
      p: 2,
      mb: 1,
      textAlign: 'center',
      boxShadow: 2
    }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', m: 0, fontSize: 20, letterSpacing: 1 }}>{title}</Typography>
    </Paper>
    <Box sx={{ p: 2, background: 'transparent' }}>{children}</Box>
  </Box>
);

// Componente auxiliar para ajustar el mapa a los puntos
const FitBoundsToPoints: React.FC<{ fugaLat: number, fugaLon: number, detLat: number, detLon: number }> = ({ fugaLat, fugaLon, detLat, detLon }) => {
  const map = useMap();
  useEffect(() => {
    if (
      typeof fugaLat === 'number' && typeof fugaLon === 'number' &&
      typeof detLat === 'number' && typeof detLon === 'number'
    ) {
      map.fitBounds([
        [fugaLat, fugaLon],
        [detLat, detLon]
      ], { padding: [50, 50] });
    }
  }, [fugaLat, fugaLon, detLat, detLon, map]);
  return null;
};

// Utilidad para mostrar solo si el dato es válido
const mostrarSiValido = (valor: any) => {
  if (valor === undefined || valor === null) return false;
  if (typeof valor === 'string' && (valor.trim() === '' || valor.trim().toUpperCase() === 'S/D')) return false;
  if (Array.isArray(valor) && valor.length === 0) return false;
  return true;
};

const getEstadoColor = (estado: string) => {
  if (!estado) return '#777';
  const e = estado.trim().toLowerCase();
  if (e === 'captura vigente') return '#b80000';
  if (e === 'detenido') return '#006400';
  if (e === 'sin efecto') return '#e6a700';
  return '#1976d2';
};

// Agrega la animación global para el latido
// Animación de latido para el chip de estado
const latidoKeyframes = `
@keyframes latido-captura {
  0% { transform: scale(1); opacity: 1; }
  30% { transform: scale(1.08); opacity: 0.85; }
  60% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
.latido {
  animation: latido-captura 1.2s ease-in-out infinite;
}
`;

const ExpedienteDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  // Estado para galería de fotos
  const [fotoGaleriaOpen, setFotoGaleriaOpen] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchExpediente(Number(id));
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchExpediente = async (expedienteId: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = await expedienteService.getExpedienteById(expedienteId);
      setExpediente(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar el expediente');
    } finally {
      setLoading(false);
    }
  };

  // Inyectar el style global para la animación si no existe
  React.useEffect(() => {
    if (!document.getElementById('latido-captura-style')) {
      const style = document.createElement('style');
      style.id = 'latido-captura-style';
      style.innerHTML = latidoKeyframes;
      document.head.appendChild(style);
    }
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !expediente) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="error" variant="h6">{error || 'Expediente no encontrado'}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Volver
        </Button>
      </Box>
    );
  }

  // Logo de la fuerza
  const fuerza = (expediente.fuerzaAsignada || '').toUpperCase();
  const logoFuerza = fuerzaIconos[fuerza]?.src || '/images/logo-cufre-2.png';
  const altFuerza = fuerzaIconos[fuerza]?.alt || 'Fuerza asignada';

  // Obtener el imputado principal (prófugo)
  const imputado: PersonaExpediente | undefined = expediente.personaExpedientes?.find(
    (p: PersonaExpediente) => (p.tipoRelacion || '').toLowerCase() === 'imputado'
  );
  const persona = imputado?.persona;
  const nombreProfugo = persona
    ? `${persona.nombre || ''} ${persona.apellido || ''}`.trim()
    : imputado
      ? `${imputado.nombre || ''} ${imputado.apellido || ''}`.trim()
      : '';
  const domicilios = imputado?.domicilios || [];

  // Foto principal
  const fotoPrincipal = expediente.fotografias?.find(f => f.id === expediente.fotoPrincipalId);

  // Personas relacionadas (excluyendo imputado principal)
  const personasRelacionadas: PersonaExpediente[] = expediente.personaExpedientes
    ? expediente.personaExpedientes.filter((p: PersonaExpediente) => (p.tipoRelacion || '').toLowerCase() !== 'imputado')
    : [];

  // Función para obtener la URL absoluta de la foto
  const getFotoUrl = (foto: Fotografia | undefined) => {
    if (!foto) return '';
    if (foto.rutaArchivo?.startsWith('http')) return foto.rutaArchivo;
    return foto.rutaArchivo
      ? `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080'}${foto.rutaArchivo}`
      : '';
  };

  // Documentos adjuntos (simulación: expediente.documentos)
  const documentos = expediente.documentos || [];
  const tieneDocumentos = Array.isArray(documentos) && documentos.length > 0;

  // Fotos galería (todas menos la principal)
  const fotosGaleria = expediente.fotografias?.filter(f => f.id !== expediente.fotoPrincipalId) || [];
  const tieneGaleria = fotosGaleria.length > 0;

  return (
    <Box sx={{ maxWidth: 950, mx: 'auto', my: 4, p: { xs: 1, sm: 3 }, background: 'transparent', borderRadius: 4, boxShadow: 6, position: 'relative', minHeight: '90vh' }}>
      {/* Botón flotante para exportar PDF */}
      <Tooltip title="Exportar PDF / Imprimir">
        <Button
          variant="contained"
          color="primary"
          startIcon={<PrintIcon />}
          onClick={() => window.print()}
          className="no-print"
          sx={{
            position: 'fixed',
            top: { xs: 80, sm: 90 },
            right: 32,
            zIndex: 2000,
            boxShadow: 4,
            borderRadius: 2,
            fontWeight: 'bold',
            textTransform: 'none',
            px: 2,
            py: 1.2
          }}
        >
          Exportar PDF
        </Button>
      </Tooltip>
      {/* Marca de agua CONFIDENCIAL */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-30deg)',
          fontSize: { xs: 40, sm: 80, md: 120 },
          fontWeight: 'bold',
          color: 'rgba(200,0,0,0.08)',
          zIndex: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          width: '100%',
          textAlign: 'center',
        }}
      >
        CONFIDENCIAL
      </Box>
      {/* Encabezado */}
      <Paper sx={{ display: 'flex', alignItems: 'center', p: 3, mb: 3, boxShadow: 6, borderRadius: 3, background: '#fff', position: 'relative', zIndex: 1 }}>
        {/* Logo CUFRE SIEMPRE A LA IZQUIERDA */}
        <Box sx={{ flex: '0 0 100px', mr: 3 }}>
          <img src="/images/logo-cufre-2.png" alt="Logo CUFRE" style={{ height: 80, objectFit: 'contain' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#002856' }}>Expediente #{expediente.numero}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Chip
              label={expediente.estadoSituacion}
              sx={{
                fontWeight: 'bold',
                fontSize: 16,
                bgcolor: getEstadoColor(expediente.estadoSituacion),
                color: ['#e6a700','#b80000'].includes(getEstadoColor(expediente.estadoSituacion)) ? '#fff' : '#000',
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
              className={
                (expediente.estadoSituacion || '').trim().toLowerCase() === 'captura vigente'
                  ? 'latido'
                  : undefined
              }
            />
            <Typography variant="h6" sx={{ ml: 2 }}>
              {nombreProfugo || 'Sin prófugo principal'}
            </Typography>
            {tieneDocumentos && (
              <Tooltip title="Este expediente tiene documentos adjuntos">
                <InsertDriveFileIcon sx={{ color: '#1976d2', ml: 2, fontSize: 32 }} />
              </Tooltip>
            )}
          </Box>
        </Box>
        {/* Logo de fuerza y foto del prófugo a la derecha */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          {logoFuerza && (
            <img src={logoFuerza} alt={altFuerza} style={{ height: 40, objectFit: 'contain', marginBottom: 4 }} />
          )}
          {fotoPrincipal && (
            <img
              src={getFotoUrl(fotoPrincipal)}
              alt="Foto principal del prófugo"
              style={{ height: 90, width: 70, objectFit: 'cover', borderRadius: 8, border: '2px solid #1976d2', background: '#fff' }}
            />
          )}
        </Box>
      </Paper>

      {/* GALERÍA DE FOTOS */}
      {tieneGaleria && (
        <Section title="GALERÍA DE FOTOS">
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {fotosGaleria.map((foto, idx) => (
              <Box key={foto.id || idx} sx={{ cursor: 'pointer', border: '2px solid #eee', borderRadius: 2, overflow: 'hidden', width: 100, height: 100, bgcolor: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onClick={() => { setFotoSeleccionada(getFotoUrl(foto)); setFotoGaleriaOpen(true); }}
              >
                <img src={getFotoUrl(foto)} alt={`Foto ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </Box>
            ))}
          </Box>
          {/* Modal para ver foto grande */}
          <Dialog open={fotoGaleriaOpen} onClose={() => setFotoGaleriaOpen(false)} maxWidth="md">
            <DialogContent sx={{ p: 0, bgcolor: '#222' }}>
              <IconButton onClick={() => setFotoGaleriaOpen(false)} sx={{ position: 'absolute', right: 8, top: 8, color: '#fff', zIndex: 2 }}>
                <CloseIcon />
              </IconButton>
              {fotoSeleccionada && (
                <img src={fotoSeleccionada} alt="Foto grande" style={{ maxWidth: '90vw', maxHeight: '80vh', display: 'block', margin: '0 auto', background: '#222' }} />
              )}
            </DialogContent>
          </Dialog>
        </Section>
      )}

      {/* DOCUMENTOS ADJUNTOS */}
      {tieneDocumentos && (
        <Section title="DOCUMENTOS ADJUNTOS">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {documentos.map((doc: any, idx: number) => (
              <Box key={doc.id || idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, bgcolor: '#f8f8f8', p: 1.5, borderRadius: 2 }}>
                <InsertDriveFileIcon sx={{ color: '#1976d2', fontSize: 32 }} />
                <Typography variant="body1" sx={{ flex: 1 }}>{doc.nombre || doc.titulo || `Documento ${idx + 1}`}</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  href={doc.url || doc.rutaArchivo}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<InsertDriveFileIcon />}
                >
                  Descargar
                </Button>
              </Box>
            ))}
          </Box>
        </Section>
      )}

      {/* Datos principales del expediente */}
      <Section title="Datos principales del expediente">
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 3,
          background: 'transparent',
          borderRadius: 0,
          p: 0,
        }}>
          <Box>
            {mostrarSiValido(expediente.numeroCausa) && (<><b>Número de causa:</b> {expediente.numeroCausa}<br /></>)}
            {mostrarSiValido(expediente.caratula) && (<><b>Carátula:</b> {expediente.caratula}<br /></>)}
            {mostrarSiValido(expediente.fechaIngreso || expediente.fechaInicio) && (<><b>Fecha de inicio:</b> {expediente.fechaIngreso || expediente.fechaInicio}<br /></>)}
            {mostrarSiValido(expediente.jurisdiccion) && (<><b>Jurisdicción:</b> {expediente.jurisdiccion}<br /></>)}
            {mostrarSiValido(expediente.juzgado) && (<><b>Juzgado:</b> {expediente.juzgado}<br /></>)}
            {mostrarSiValido(expediente.secretaria) && (<><b>Secretaría:</b> {expediente.secretaria}<br /></>)}
            {mostrarSiValido(expediente.fiscalia) && (<><b>Fiscalía:</b> {expediente.fiscalia}<br /></>)}
            {mostrarSiValido(expediente.provincia) && (<><b>Provincia:</b> {expediente.provincia}<br /></>)}
            {mostrarSiValido(expediente.tipoCaptura) && (<><b>Tipo de captura:</b> {expediente.tipoCaptura}<br /></>)}
            {mostrarSiValido(expediente.motivoCaptura) && (<><b>Motivo de captura:</b> {expediente.motivoCaptura}<br /></>)}
          </Box>
          <Box>
            {mostrarSiValido(expediente.delitos) && expediente.delitos.length > 0 && (
              <><b>Delitos asociados:</b> {expediente.delitos.map(d => d.id).join(', ')}<br /></>
            )}
            {mostrarSiValido(expediente.prioridad) && (<><b>Prioridad:</b> {expediente.prioridad}<br /></>)}
            {mostrarSiValido(expediente.recompensa) && (<><b>Recompensa:</b> {expediente.recompensa}<br /></>)}
            {mostrarSiValido(expediente.descripcion) && (<><b>Descripción:</b> {expediente.descripcion}<br /></>)}
          </Box>
        </Box>
      </Section>

      {/* Sección Prófugo */}
      <Section title="Prófugo">
        {nombreProfugo ? (
          <Box sx={{ background: 'transparent', borderRadius: 0, p: 0, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            <Box sx={{ flex: 1 }}>
              {mostrarSiValido(nombreProfugo) && (<><b>Nombre completo:</b> {nombreProfugo}<br /></>)}
              {(mostrarSiValido(persona?.tipoDocumento) || mostrarSiValido(imputado?.dni) || mostrarSiValido(persona?.numeroDocumento)) && (
                <><b>Documento:</b> {persona?.tipoDocumento || imputado?.dni || ''} {persona?.numeroDocumento || ''}<br /></>
              )}
              {mostrarSiValido(domicilios) && domicilios.length > 0 && (
                <>
                  <b>Domicilios:</b>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {domicilios.map((dom: any, idx: number) => (
                      <li key={idx} style={{ marginBottom: 4 }}>
                        <Typography variant="body2" sx={{ color: '#333' }}>
                          {`${dom.calle || ''} ${dom.numero || ''}, ${dom.localidad || ''}, ${dom.provincia || ''}, ${dom.pais || ''}`.replace(/(, )+/g, ', ').replace(/^, |, $/g, '').trim()}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <Divider sx={{ my: 1 }} />
              {mostrarSiValido(expediente.profugoTez) && (<><b>Tez:</b> {expediente.profugoTez}<br /></>)}
              {mostrarSiValido(expediente.profugoContexturaFisica) && (<><b>Contextura física:</b> {expediente.profugoContexturaFisica}<br /></>)}
              {mostrarSiValido(expediente.profugoCabello) && (<><b>Cabello:</b> {expediente.profugoCabello}<br /></>)}
              {mostrarSiValido(expediente.profugoOjos) && (<><b>Ojos:</b> {expediente.profugoOjos}<br /></>)}
              {mostrarSiValido(expediente.profugoEstatura) && (<><b>Estatura:</b> {expediente.profugoEstatura} cm<br /></>)}
              {mostrarSiValido(expediente.profugoPeso) && (<><b>Peso:</b> {expediente.profugoPeso} kg<br /></>)}
              {mostrarSiValido(expediente.profugoGenero) && (<><b>Género:</b> {expediente.profugoGenero}<br /></>)}
              {mostrarSiValido(expediente.profugoNombreCompleto) && (<><b>Alias:</b> {expediente.profugoNombreCompleto}<br /></>)}
              {mostrarSiValido(expediente.profugoSituacionProcesal) && (<><b>Situación procesal:</b> {expediente.profugoSituacionProcesal}<br /></>)}
              {expediente.profugoAntecedentes !== undefined && (
                <><b>Antecedentes:</b> {expediente.profugoAntecedentes ? 'Sí' : 'No'}<br /></>
              )}
              {mostrarSiValido(expediente.profugoDetalleAntecedentes) && (<><b>Detalle antecedentes:</b> {expediente.profugoDetalleAntecedentes}<br /></>)}
              {mostrarSiValido(expediente.profugoMarcasVisibles) && (<><b>Marcas visibles:</b> {expediente.profugoMarcasVisibles}<br /></>)}
              {mostrarSiValido(expediente.profugoProfesionOcupacion) && (<><b>Profesión/Ocupación:</b> {expediente.profugoProfesionOcupacion}<br /></>)}
              {mostrarSiValido(expediente.profugoGrupoSanguineo) && (<><b>Grupo sanguíneo:</b> {expediente.profugoGrupoSanguineo}<br /></>)}
              {mostrarSiValido(expediente.profugoTelefono) && (<><b>Teléfono:</b> {expediente.profugoTelefono}<br /></>)}
            </Box>
          </Box>
        ) : (
          <Typography color="text.secondary">Sin prófugo principal</Typography>
        )}
      </Section>

      {/* Personas relacionadas */}
      <Section title="Personas relacionadas">
        {personasRelacionadas.length > 0 ? (
          <Box sx={{ background: 'transparent', borderRadius: 0, p: 0 }}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {personasRelacionadas.map((p: PersonaExpediente, idx: number) => (
                (mostrarSiValido(p.persona?.nombre) || mostrarSiValido(p.nombre)) && (
                  <li key={p.id || idx} style={{ marginBottom: 4 }}>
                    <Typography variant="body2" sx={{ color: '#333' }}>
                      <b>{p.persona ? `${p.persona.nombre || ''} ${p.persona.apellido || ''}`.trim() : `${p.nombre || ''} ${p.apellido || ''}`.trim()}</b> {mostrarSiValido(p.tipoRelacion) && `(${p.tipoRelacion})`}
                      {mostrarSiValido(p.observaciones) ? ` - ${p.observaciones}` : ''}
                    </Typography>
                  </li>
                )
              ))}
            </ul>
          </Box>
        ) : (
          <Typography color="text.secondary">No hay otras personas relacionadas.</Typography>
        )}
      </Section>

      {/* Mapa de puntos de fuga y detención (al final) */}
      {(expediente.fugaLatitud && expediente.fugaLongitud) || (expediente.detencionLatitud && expediente.detencionLongitud) ? (
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Mapa de Ubicación</Typography>
          <MapContainer
            center={
              expediente.fugaLatitud && expediente.fugaLongitud
                ? [expediente.fugaLatitud, expediente.fugaLongitud]
                : expediente.detencionLatitud && expediente.detencionLongitud
                ? [expediente.detencionLatitud, expediente.detencionLongitud]
                : [-34.6, -58.4] // centro por defecto (Buenos Aires)
            }
            zoom={12}
            style={{ height: '400px', width: '100%' }}
            scrollWheelZoom={true}
          >
            {typeof expediente.fugaLatitud === 'number' && typeof expediente.fugaLongitud === 'number' &&
             typeof expediente.detencionLatitud === 'number' && typeof expediente.detencionLongitud === 'number' && (
              <FitBoundsToPoints
                fugaLat={expediente.fugaLatitud}
                fugaLon={expediente.fugaLongitud}
                detLat={expediente.detencionLatitud}
                detLon={expediente.detencionLongitud}
              />
            )}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            {expediente.fugaLatitud && expediente.fugaLongitud && (
              <Marker
                position={[expediente.fugaLatitud, expediente.fugaLongitud]}
                icon={new L.Icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Popup>
                  <strong>PUNTO DE FUGA</strong><br />
                  {expediente.fugaLugar || 'Sin lugar especificado'}
                </Popup>
              </Marker>
            )}
            {expediente.detencionLatitud && expediente.detencionLongitud && (
              <Marker
                position={[expediente.detencionLatitud, expediente.detencionLongitud]}
                icon={new L.Icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}
              >
                <Popup>
                  <strong>PUNTO DE DETENCIÓN</strong><br />
                  {expediente.detencionLugar || 'Sin lugar especificado'}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </Box>
      ) : null}

      {/* Pie de página institucional */}
      <Box sx={{ mt: 6, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h5" sx={{ color: '#b80000', fontWeight: 'bold', mb: 1, letterSpacing: 1 }}>
          INFORMACIÓN CONFIDENCIAL
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Informe generado por el Sistema CUFRE
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: '#555' }}>
          Fecha y hora de generación: {new Date().toLocaleString('es-AR')}
        </Typography>
        <img src="/images/escudo HD.png" alt="Escudo Dirección Nacional" style={{ height: 60, margin: '0 auto' }} />
        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#002856', fontWeight: 'bold' }}>
          Dirección Nacional de Gestión de Bases de Datos de Seguridad
        </Typography>
      </Box>
    </Box>
  );
};

export default ExpedienteDetallePage; 