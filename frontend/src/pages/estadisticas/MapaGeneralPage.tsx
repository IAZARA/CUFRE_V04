import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Alert, Paper, Switch, FormControlLabel, Checkbox, FormGroup, FormControl, FormLabel } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngTuple, Icon } from 'leaflet';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded';
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import expedienteService from '../../api/expedienteService';
// @ts-ignore
import { HeatmapLayer } from 'react-leaflet-heatmap-layer-v3';

// Fix para los iconos de Leaflet en React
const iconUrl = require('leaflet/dist/images/marker-icon.png');
const iconShadow = require('leaflet/dist/images/marker-shadow.png');

const iconFuga = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const iconDetencion = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + '/images/marker-icon-green.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MAP_CENTER: LatLngTuple = [-38.4161, -63.6167]; // Centro de Argentina
const MAP_ZOOM = 4.5;

const MapaGeneralPage: React.FC = () => {
  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFuga, setShowFuga] = useState(true);
  const [showDetencion, setShowDetencion] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    const fetchExpedientes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await expedienteService.getAll();
        setExpedientes(data);
      } catch (err: any) {
        setError('Error al cargar los expedientes');
      } finally {
        setLoading(false);
      }
    };
    fetchExpedientes();
  }, []);

  // Filtrar puntos según selección
  const puntosFuga = showFuga ? expedientes.filter((exp: any) => exp.fugaLatitud && exp.fugaLongitud) : [];
  const puntosDetencion = showDetencion ? expedientes.filter((exp: any) => exp.detencionLatitud && exp.detencionLongitud) : [];

  // Datos para el heatmap (solo puntos seleccionados)
  const heatmapPoints = [
    ...puntosFuga.map((exp: any) => [Number(exp.fugaLatitud), Number(exp.fugaLongitud), 1]),
    ...puntosDetencion.map((exp: any) => [Number(exp.detencionLatitud), Number(exp.detencionLongitud), 1])
  ];

  return (
    <Box>
      {/* Fila superior: título a la izquierda, controles a la derecha */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'stretch', md: 'center' },
        justifyContent: { xs: 'flex-start', md: 'space-between' },
        gap: 2,
        mt: 2,
        mb: 3
      }}>
        {/* Título alineado a la izquierda */}
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 270 }}>
          <PlaceRoundedIcon sx={{ color: '#1976d2', fontSize: 40, minWidth: 40, mr: 1 }} />
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', textAlign: 'left' }}>
            Mapa
          </Typography>
        </Box>
        {/* Controles y tarjetas a la derecha */}
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'flex-end' }}>
          <FormControl component="fieldset" sx={{ minWidth: 180 }}>
            <FormLabel component="legend" sx={{ color: '#1976d2', fontWeight: 600, mb: 1 }}>Mostrar:</FormLabel>
            <FormGroup row>
              <FormControlLabel
                control={<Checkbox checked={showFuga} onChange={() => setShowFuga(v => !v)} sx={{ color: '#d32f2f' }} />}
                label={<span style={{ color: '#d32f2f', fontWeight: 500 }}>Puntos de Fuga</span>}
              />
              <FormControlLabel
                control={<Checkbox checked={showDetencion} onChange={() => setShowDetencion(v => !v)} sx={{ color: '#388e3c' }} />}
                label={<span style={{ color: '#388e3c', fontWeight: 500 }}>Puntos de Detención</span>}
              />
            </FormGroup>
          </FormControl>
          <Paper elevation={4} sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, borderRadius: 3, background: '#f5faff', minWidth: 120 }}>
            <ListAltRoundedIcon sx={{ color: '#d32f2f', fontSize: 32, mr: 2 }} />
            <Box>
              <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 700, lineHeight: 1 }}>
                {puntosFuga.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 500 }}>
                fuga
              </Typography>
            </Box>
          </Paper>
          <Paper elevation={4} sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, borderRadius: 3, background: '#f5faff', minWidth: 120 }}>
            <ListAltRoundedIcon sx={{ color: '#388e3c', fontSize: 32, mr: 2 }} />
            <Box>
              <Typography variant="h5" sx={{ color: '#388e3c', fontWeight: 700, lineHeight: 1 }}>
                {puntosDetencion.length}
              </Typography>
              <Typography variant="body2" sx={{ color: '#388e3c', fontWeight: 500 }}>
                detención
              </Typography>
            </Box>
          </Paper>
          <Paper elevation={4} sx={{ display: 'flex', alignItems: 'center', px: 3, py: 2, borderRadius: 3, background: '#f5faff', minWidth: 220 }}>
            <MapRoundedIcon sx={{ color: '#1976d2', fontSize: 34, mr: 2 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={showHeatmap}
                  onChange={() => setShowHeatmap(v => !v)}
                  color="primary"
                />
              }
              label={showHeatmap ? 'Ver como marcadores' : 'Ver como mapa de calor'}
              sx={{ fontWeight: 500 }}
            />
          </Paper>
        </Box>
      </Box>
      {loading && <CircularProgress sx={{ mt: 4 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {!loading && !error && (
        <Box sx={{ height: 600, width: '100%', mt: 3 }}>
          <MapContainer center={MAP_CENTER} zoom={MAP_ZOOM} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {showHeatmap ? (
              <HeatmapLayer
                fitBoundsOnLoad
                fitBoundsOnUpdate
                points={heatmapPoints}
                longitudeExtractor={(m: number[]) => m[1]}
                latitudeExtractor={(m: number[]) => m[0]}
                intensityExtractor={(m: number[]) => m[2]}
                radius={20}
                blur={15}
                max={1}
              />
            ) : (
              <>
                {puntosFuga.map((exp: any, idx: number) => {
                  const lat = Number(exp.fugaLatitud);
                  const lng = Number(exp.fugaLongitud);
                  if (isNaN(lat) || isNaN(lng)) return null;
                  const position: LatLngTuple = [lat, lng];
                  // Obtener nombre del prófugo como en ExpedienteDetallePage
                  let nombreProfugo = 'Sin dato';
                  if (Array.isArray(exp.personaExpedientes)) {
                    const imputado = exp.personaExpedientes.find((p: any) => (p.tipoRelacion || '').toLowerCase() === 'imputado');
                    if (imputado) {
                      if (imputado.persona) {
                        nombreProfugo = `${imputado.persona.nombre || ''} ${imputado.persona.apellido || ''}`.trim();
                      } else {
                        nombreProfugo = `${imputado.nombre || ''} ${imputado.apellido || ''}`.trim();
                      }
                    }
                    if (!nombreProfugo) nombreProfugo = 'Sin dato';
                  }
                  return (
                    <Marker
                      key={`fuga-${exp.id || idx}`}
                      position={position}
                      icon={iconFuga}
                    >
                      <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Número Expediente: {exp.numero || 'Sin número'}
                        </Typography>
                        <Typography variant="body2">
                          Nombre Prófugo: {nombreProfugo}
                        </Typography>
                        <Typography variant="body2">
                          Lugar Fuga: {exp.fugaLugar || 'Sin dato'}
                        </Typography>
                      </Tooltip>
                      <Popup>
                        <Typography variant="subtitle2" gutterBottom>
                          <b>Expediente:</b> {exp.numero || 'Sin número'}
                        </Typography>
                        <Typography variant="body2">
                          <b>Lugar de fuga:</b> {exp.fugaLugar || 'Sin dato'}
                        </Typography>
                      </Popup>
                    </Marker>
                  );
                })}
                {puntosDetencion.map((exp: any, idx: number) => {
                  const lat = Number(exp.detencionLatitud);
                  const lng = Number(exp.detencionLongitud);
                  if (isNaN(lat) || isNaN(lng)) return null;
                  const position: LatLngTuple = [lat, lng];
                  // Obtener nombre del prófugo como en ExpedienteDetallePage
                  let nombreProfugo = 'Sin dato';
                  if (Array.isArray(exp.personaExpedientes)) {
                    const imputado = exp.personaExpedientes.find((p: any) => (p.tipoRelacion || '').toLowerCase() === 'imputado');
                    if (imputado) {
                      if (imputado.persona) {
                        nombreProfugo = `${imputado.persona.nombre || ''} ${imputado.persona.apellido || ''}`.trim();
                      } else {
                        nombreProfugo = `${imputado.nombre || ''} ${imputado.apellido || ''}`.trim();
                      }
                    }
                    if (!nombreProfugo) nombreProfugo = 'Sin dato';
                  }
                  return (
                    <Marker
                      key={`detencion-${exp.id || idx}`}
                      position={position}
                      icon={iconDetencion}
                    >
                      <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          Número Expediente: {exp.numero || 'Sin número'}
                        </Typography>
                        <Typography variant="body2">
                          Nombre Prófugo: {nombreProfugo}
                        </Typography>
                        <Typography variant="body2">
                          Lugar Detención: {exp.detencionLugar || 'Sin dato'}
                        </Typography>
                      </Tooltip>
                      <Popup>
                        <Typography variant="subtitle2" gutterBottom>
                          <b>Expediente:</b> {exp.numero || 'Sin número'}
                        </Typography>
                        <Typography variant="body2">
                          <b>Lugar de detención:</b> {exp.detencionLugar || 'Sin dato'}
                        </Typography>
                      </Popup>
                    </Marker>
                  );
                })}
              </>
            )}
          </MapContainer>
        </Box>
      )}
    </Box>
  );
};

export default MapaGeneralPage; 