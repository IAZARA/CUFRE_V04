import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SettingsIcon from '@mui/icons-material/Settings';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import PhoneIcon from '@mui/icons-material/Phone';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Badge from '@mui/material/Badge';
import expedienteService from '../../api/expedienteService';
import { Expediente } from '../../types/expediente.types';

const LOGO_MINISTERIO = '/images/logo ministerio seguridad nacional.png';
const LOGO_CUFRE = '/images/logo-cufre-2.png';
const LOGO_DIRECCION = '/images/escudo HD.png';
const LOGO_FALLBACK = '/img/default.jpg';

const getFotoUrl = (exp: Expediente) => {
  const foto = exp.fotografias?.find(f => f.id === exp.fotoPrincipalId);
  if (!foto) return LOGO_FALLBACK;
  if (foto.rutaArchivo?.startsWith('http')) return foto.rutaArchivo;
  return foto.rutaArchivo
    ? `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080'}${foto.rutaArchivo}`
    : LOGO_FALLBACK;
};

const obtenerDelito = (exp: Expediente) => {
  if (exp.delitos && Array.isArray(exp.delitos) && exp.delitos.length > 0) {
    // Puede venir como { id, nombre } o solo { id }
    const delito = exp.delitos[0] as any;
    return delito.nombre || delito.delitoNombre || 'Delito no especificado';
  }
  return 'Delito no especificado';
};

const obtenerNombre = (exp: Expediente) => {
  // Buscar imputado principal
  const imputado = exp.personaExpedientes?.find(p => (p.tipoRelacion || '').toLowerCase() === 'imputado');
  if (imputado && imputado.persona) {
    return `${imputado.persona.nombre || ''} ${imputado.persona.apellido || ''}`.trim() || 'Prófugo no especificado';
  }
  // Fallback a primer persona
  if (exp.personaExpedientes && exp.personaExpedientes.length > 0 && exp.personaExpedientes[0].persona) {
    return `${exp.personaExpedientes[0].persona.nombre || ''} ${exp.personaExpedientes[0].persona.apellido || ''}`.trim();
  }
  return 'Prófugo no especificado';
};

const IterarMasBuscadosPage: React.FC = () => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intervalTime, setIntervalTime] = useState(10000);
  const [showConfig, setShowConfig] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Cargar expedientes al montar
  useEffect(() => {
    const fetchMasBuscados = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await expedienteService.getMasBuscados(50); // puedes ajustar el límite
        setExpedientes(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar los expedientes más buscados.');
      } finally {
        setLoading(false);
      }
    };
    fetchMasBuscados();
    document.title = 'CUFRE - Iterar Más Buscados';
  }, []);

  // Rotación automática
  useEffect(() => {
    if (expedientes.length === 0 || intervalTime <= 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % expedientes.length);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [expedientes, intervalTime]);

  // Pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);
      if (isFS) {
        document.body.classList.add('app-fullscreen-mode');
      } else {
        document.body.classList.remove('app-fullscreen-mode');
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.body.classList.remove('app-fullscreen-mode');
    };
  }, []);

  const toggleFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (!isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }, [isFullscreen]);

  // Renderizado principal
  let content: React.ReactNode = null;
  if (loading) {
    content = <Box sx={{ textAlign: 'center', my: 8 }}><CircularProgress /></Box>;
  } else if (error) {
    content = <Alert severity="error">{error}</Alert>;
  } else if (expedientes.length === 0) {
    content = <Alert severity="info">No se encontraron expedientes para mostrar.</Alert>;
  } else {
    const exp = expedientes[currentIndex];
    const nombre = obtenerNombre(exp);
    const delito = obtenerDelito(exp);
    const fotoUrl = getFotoUrl(exp);
    content = (
      <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden', minHeight: isMobile ? 400 : 600, maxWidth: 1400, mx: 'auto', my: 2 }}>
        {/* Header */}
        <Box sx={{ background: '#242c50', color: '#fff', py: 2, textAlign: 'center' }}>
          <Typography variant="h6" fontWeight={600}>
            INFORMACIÓN REQUERIDA POR EL MINISTERIO DE SEGURIDAD NACIONAL
          </Typography>
        </Box>
        <Grid container>
          {/* Columna izquierda */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, p: { xs: 2, md: 5 }, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Typography variant="h1" fontWeight={900} color="error" sx={{ textTransform: 'uppercase', mb: 3, fontSize: { xs: '2.5rem', md: '5rem' }, letterSpacing: 2 }}>
                BUSCADO
              </Typography>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 2, fontSize: { xs: '1.5rem', md: '2.5rem' } }}>
                {nombre}
              </Typography>
              <Box sx={{ mt: 2, mb: 3 }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    bgcolor: '#c0392b',
                    color: '#fff',
                    px: 3,
                    py: 1.2,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    textAlign: 'center',
                    maxWidth: { xs: 320, md: 500 },
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-line',
                    boxShadow: 2,
                  }}
                >
                  {delito}
                </Box>
              </Box>
              {exp.recompensa && (
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Paper elevation={2} sx={{ bgcolor: '#198754', color: '#fff', borderRadius: 2, px: 4, py: 2, display: 'inline-block', transform: 'rotate(-2deg)', textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700}>RECOMPENSA</Typography>
                    <Typography variant="h4" fontWeight={700}>{exp.recompensa}</Typography>
                  </Paper>
                </Box>
              )}
              <Box sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: '#fff', border: '2px solid #ffc107', borderRadius: 8, px: 3, py: 2 }}>
                  <PhoneIcon sx={{ color: '#ffc107', mr: 2 }} />
                  <Box>
                    <Typography variant="h6" fontWeight={700} color="text.primary">Avisar a las Autoridades</Typography>
                    <Typography variant="body2" color="text.secondary">Llama al 134 (Min. Seguridad) o al 911 (Policía)</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            {/* Logos */}
            <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #eee', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar src={LOGO_MINISTERIO} alt="Ministerio de Seguridad Nacional" sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }} variant="rounded" />
                <Typography variant="caption" color="text.secondary">Ministerio de Seguridad Nacional<br />de la República Argentina</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar src={LOGO_CUFRE} alt="CUFRE" sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }} variant="rounded" />
                <Typography variant="caption" color="text.secondary">Comando Unificado Federal<br />de Recaptura de Evadidos</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar src={LOGO_DIRECCION} alt="Dirección Nacional" sx={{ width: 60, height: 60, mx: 'auto', mb: 1 }} variant="rounded" />
                <Typography variant="caption" color="text.secondary">Dirección Nacional<br />Gestión de Bases de Datos<br />de Seguridad</Typography>
              </Box>
            </Box>
          </Box>
          {/* Columna derecha - Foto */}
          <Box sx={{ width: { xs: '100%', md: '50%' }, bgcolor: '#181c2a', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0 }}>
            <Box sx={{ width: '100%', height: isMobile ? 320 : 500, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <img
                src={fotoUrl}
                alt={`Foto de ${nombre}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, background: '#222' }}
                onError={e => { (e.target as HTMLImageElement).src = LOGO_FALLBACK; }}
              />
            </Box>
          </Box>
        </Grid>
      </Paper>
    );
  }

  return (
    <React.Fragment>
      {/* Contenedor fullscreen si está activo */}
      {isFullscreen && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: '#fff',
            zIndex: 2000,
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={2} justifyContent="flex-end" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <IconButton onClick={() => setShowConfig(v => !v)} color="primary" title="Configurar intervalo">
                  <SettingsIcon />
                </IconButton>
              </Box>
              <Box>
                <IconButton onClick={toggleFullscreen} color="primary" title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
                  {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                </IconButton>
              </Box>
            </Grid>
            {showConfig && (
              <Box sx={{ mb: 3, maxWidth: 320 }}>
                <TextField
                  label="Intervalo de rotación (segundos)"
                  type="number"
                  value={intervalTime / 1000}
                  onChange={e => {
                    const seconds = parseInt(e.target.value, 10);
                    if (!isNaN(seconds) && seconds > 0) {
                      setIntervalTime(seconds * 1000);
                    } else if (e.target.value === '') {
                      setIntervalTime(1000);
                    }
                  }}
                  inputProps={{ min: 1 }}
                  fullWidth
                  size="small"
                />
              </Box>
            )}
            {content}
          </Box>
        </Box>
      )}
      {/* Contenido normal si no está en fullscreen */}
      {!isFullscreen && (
        <Box sx={{ p: isMobile ? 1 : 4, minHeight: '80vh', bgcolor: isFullscreen ? '#181c2a' : 'background.default', transition: 'background 0.3s' }}>
          <Grid container spacing={2} justifyContent="flex-end" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <IconButton onClick={() => setShowConfig(v => !v)} color="primary" title="Configurar intervalo">
                <SettingsIcon />
              </IconButton>
            </Box>
            <Box>
              <IconButton onClick={toggleFullscreen} color="primary" title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Box>
          </Grid>
          {showConfig && (
            <Box sx={{ mb: 3, maxWidth: 320 }}>
              <TextField
                label="Intervalo de rotación (segundos)"
                type="number"
                value={intervalTime / 1000}
                onChange={e => {
                  const seconds = parseInt(e.target.value, 10);
                  if (!isNaN(seconds) && seconds > 0) {
                    setIntervalTime(seconds * 1000);
                  } else if (e.target.value === '') {
                    setIntervalTime(1000);
                  }
                }}
                inputProps={{ min: 1 }}
                fullWidth
                size="small"
              />
            </Box>
          )}
          {content}
        </Box>
      )}
    </React.Fragment>
  );
};

export default IterarMasBuscadosPage; 