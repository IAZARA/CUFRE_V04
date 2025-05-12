import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import expedienteService from '../../api/expedienteService';

const FUERZAS = [
  'TODAS',
  'PFA',
  'GNA',
  'PSA',
  'PNA',
  'SPF',
  'INTERPOOL',
  'CUFRE',
  'SIN DATO'
];
const ESTADOS = [
  'TODOS',
  'DETENIDO',
  'CAPTURA VIGENTE',
  'SIN EFECTO',
  'SIN DATO'
];
const COLORS = [
  '#1976d2', '#388e3c', '#bfa16c', '#8e24aa', '#ffd600', '#d32f2f', '#757575', '#4fc3f7', '#222', '#424242'
];

function groupByDelito(expedientes: any[], fuerza: string, estado: string) {
  const map = new Map();
  expedientes.forEach((exp: any) => {
    if (
      (fuerza === 'TODAS' || (exp.fuerzaAsignada || exp.fuerza || 'SIN DATO').toUpperCase() === fuerza) &&
      (estado === 'TODOS' || (exp.estado || 'SIN DATO').toUpperCase() === estado)
    ) {
      const delitos = exp.delitos || [];
      if (delitos.length === 0) {
        map.set('SIN DATO', (map.get('SIN DATO') || 0) + 1);
      } else {
        delitos.forEach((d: any) => {
          const nombre = (d.nombre || d.descripcion || d || 'SIN DATO').toUpperCase();
          map.set(nombre, (map.get(nombre) || 0) + 1);
        });
      }
    }
  });
  // Ordenar por cantidad descendente
  return Array.from(map.entries())
    .map(([delito, count]) => ({ delito, count }))
    .sort((a, b) => b.count - a.count);
}

const RankingDelitosPage = () => {
  const [expedientes, setExpedientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fuerza, setFuerza] = useState('TODAS');
  const [estado, setEstado] = useState('TODOS');

  useEffect(() => {
    setLoading(true);
    expedienteService.getAll()
      .then((res: any) => {
        setExpedientes(Array.isArray(res) ? res : (res.data || []));
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron obtener los expedientes.');
        setLoading(false);
      });
  }, []);

  const data = groupByDelito(expedientes, fuerza, estado);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', py: 6 }}>
      <Box maxWidth="900px" mx="auto">
        <Paper elevation={4} sx={{ borderRadius: 5, p: 4, mb: 4, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
          <Box display="flex" alignItems="center" mb={2}>
            <GavelIcon sx={{ fontSize: 38, color: '#1976d2', mr: 2 }} />
            <Box>
              <Typography variant="h4" fontWeight={700} color="#222">
                Ranking de Delitos
              </Typography>
              <Typography variant="subtitle1" color="#555">
                Expedientes agrupados por tipo de delito. Puedes filtrar por fuerza y estado.
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={3} mb={3}>
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Fuerza</InputLabel>
              <Select
                value={fuerza}
                label="Fuerza"
                onChange={e => setFuerza(e.target.value)}
              >
                {FUERZAS.map(f => (
                  <MenuItem key={f} value={f}>{f}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={estado}
                label="Estado"
                onChange={e => setEstado(e.target.value)}
              >
                {ESTADOS.map(e => (
                  <MenuItem key={e} value={e}>{e}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : data.length === 0 ? (
            <Alert severity="info">No hay datos para mostrar.</Alert>
          ) : (
            <Box height={500}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 40, left: 20, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="delito" angle={-25} textAnchor="end" interval={0} height={80} tick={{ fontWeight: 600, fontSize: 15, fill: '#222' }} />
                  <YAxis tick={{ fontWeight: 600, fontSize: 15, fill: '#222' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#222', color: '#fff', borderRadius: 8, fontWeight: 600 }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {data.map((entry, idx) => (
                      <Cell key={entry.delito} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default RankingDelitosPage; 