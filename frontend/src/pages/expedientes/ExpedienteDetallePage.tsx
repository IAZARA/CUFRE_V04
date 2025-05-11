import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Tooltip
} from '@mui/material';
import expedienteService from '../../api/expedienteService';
import { Expediente, PersonaExpediente, Fotografia } from '../../types/expediente.types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>{title}</Typography>
    <Paper sx={{ p: 2, background: '#f9f9f9' }}>{children}</Paper>
  </Box>
);

const ExpedienteDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', my: 4, p: 2 }}>
      {/* Encabezado */}
      <Paper sx={{ display: 'flex', alignItems: 'center', p: 3, mb: 3, boxShadow: 4, borderRadius: 2 }}>
        <Box sx={{ flex: '0 0 100px', mr: 2 }}>
          <img src={logoFuerza} alt={altFuerza} style={{ height: 80, objectFit: 'contain' }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Expediente #{expediente.numero}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
            <Chip label={expediente.estadoSituacion} color="primary" sx={{ fontWeight: 'bold', fontSize: 16 }} />
            <Typography variant="h6" sx={{ ml: 2 }}>
              {nombreProfugo || 'Sin prófugo principal'}
            </Typography>
          </Box>
        </Box>
        {fotoPrincipal && (
          <img
            src={getFotoUrl(fotoPrincipal)}
            alt="Foto principal del prófugo"
            style={{ height: 110, width: 90, objectFit: 'cover', borderRadius: 8, border: '2px solid #1976d2', background: '#fff' }}
          />
        )}
      </Paper>

      {/* Datos principales del expediente */}
      <Section title="Datos principales del expediente">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box>
            <b>Número de causa:</b> {expediente.numeroCausa || 'S/D'}<br />
            <b>Carátula:</b> {expediente.caratula || 'S/D'}<br />
            <b>Fecha de inicio:</b> {expediente.fechaIngreso || expediente.fechaInicio || 'S/D'}<br />
            <b>Jurisdicción:</b> {expediente.jurisdiccion || 'S/D'}<br />
            <b>Juzgado:</b> {expediente.juzgado || 'S/D'}<br />
            <b>Secretaría:</b> {expediente.secretaria || 'S/D'}<br />
            <b>Fiscalía:</b> {expediente.fiscalia || 'S/D'}<br />
            <b>Provincia:</b> {expediente.provincia || 'S/D'}<br />
            <b>Tipo de captura:</b> {expediente.tipoCaptura || 'S/D'}<br />
            <b>Motivo de captura:</b> {expediente.motivoCaptura || 'S/D'}<br />
          </Box>
          <Box>
            <b>Delitos asociados:</b> {expediente.delitos && expediente.delitos.length > 0 ? expediente.delitos.map(d => d.id).join(', ') : 'S/D'}<br />
            <b>Prioridad:</b> {expediente.prioridad || 'S/D'}<br />
            <b>Recompensa:</b> {expediente.recompensa || 'S/D'}<br />
            <b>Descripción:</b> {expediente.descripcion || 'S/D'}<br />
          </Box>
        </Box>
      </Section>

      {/* Sección Prófugo */}
      <Section title="Prófugo">
        {nombreProfugo ? (
          <Box>
            <b>Nombre completo:</b> {nombreProfugo}<br />
            <b>Documento:</b> {persona?.tipoDocumento || imputado?.dni || 'S/D'} {persona?.numeroDocumento || 'S/D'}<br />
            <b>Domicilios:</b>
            <ul>
              {domicilios.length > 0 ? domicilios.map((dom: any, idx: number) => (
                <li key={idx}>
                  {`${dom.calle || ''} ${dom.numero || ''}, ${dom.localidad || ''}, ${dom.provincia || ''}, ${dom.pais || ''}`.replace(/(, )+/g, ', ').replace(/^, |, $/g, '').trim()}
                </li>
              )) : <li>S/D</li>}
            </ul>
            <Divider sx={{ my: 1 }} />
            <b>Tez:</b> {expediente.profugoTez || 'S/D'}<br />
            <b>Contextura física:</b> {expediente.profugoContexturaFisica || 'S/D'}<br />
            <b>Cabello:</b> {expediente.profugoCabello || 'S/D'}<br />
            <b>Ojos:</b> {expediente.profugoOjos || 'S/D'}<br />
            <b>Estatura:</b> {expediente.profugoEstatura ? `${expediente.profugoEstatura} cm` : 'S/D'}<br />
            <b>Peso:</b> {expediente.profugoPeso ? `${expediente.profugoPeso} kg` : 'S/D'}<br />
            <b>Género:</b> {expediente.profugoGenero || 'S/D'}<br />
            <b>Alias:</b> {expediente.profugoNombreCompleto || 'S/D'}<br />
            <b>Situación procesal:</b> {expediente.profugoSituacionProcesal || 'S/D'}<br />
            <b>Antecedentes:</b> {expediente.profugoAntecedentes ? 'Sí' : 'No'}<br />
            <b>Detalle antecedentes:</b> {expediente.profugoDetalleAntecedentes || 'S/D'}<br />
            <b>Marcas visibles:</b> {expediente.profugoMarcasVisibles || 'S/D'}<br />
            <b>Profesión/Ocupación:</b> {expediente.profugoProfesionOcupacion || 'S/D'}<br />
            <b>Grupo sanguíneo:</b> {expediente.profugoGrupoSanguineo || 'S/D'}<br />
            <b>Teléfono:</b> {expediente.profugoTelefono || 'S/D'}<br />
          </Box>
        ) : (
          <Typography color="text.secondary">Sin prófugo principal</Typography>
        )}
      </Section>

      {/* Personas relacionadas */}
      <Section title="Personas relacionadas">
        {personasRelacionadas.length > 0 ? (
          <ul>
            {personasRelacionadas.map((p: PersonaExpediente, idx: number) => (
              <li key={p.id || idx}>
                <b>{p.persona ? `${p.persona.nombre || ''} ${p.persona.apellido || ''}`.trim() : `${p.nombre || ''} ${p.apellido || ''}`.trim()}</b> ({p.tipoRelacion})
                {p.observaciones ? ` - ${p.observaciones}` : ''}
              </li>
            ))}
          </ul>
        ) : (
          <Typography color="text.secondary">No hay otras personas relacionadas.</Typography>
        )}
      </Section>

      {/* Pie de página institucional */}
      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h5" sx={{ color: 'red', fontWeight: 'bold', mb: 1 }}>
          INFORMACIÓN CONFIDENCIAL
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Informe generado por el Sistema CUFRE
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          Fecha y hora de generación: {new Date().toLocaleString()}
        </Typography>
        <img src="/images/logo-cufre-2.png" alt="Logo CUFRE" style={{ height: 60, margin: '0 auto' }} />
        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
          Dirección Nacional de Gestión de Bases de Datos de Seguridad
        </Typography>
      </Box>
    </Box>
  );
};

export default ExpedienteDetallePage; 