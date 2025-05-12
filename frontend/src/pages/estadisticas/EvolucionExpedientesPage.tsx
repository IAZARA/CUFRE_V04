import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import TimelineIcon from '@mui/icons-material/Timeline';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import expedienteService from '../../api/expedienteService';

// Utilidad para agrupar por mes
function groupByMonth(expedientes: any[]) {
  const counts: Record<string, number> = {};
  expedientes.forEach(exp => {
    const fecha = exp.created_at || exp.fechaIngreso || exp.fechaCreacion;
    if (!fecha) return;
    // Obtener año-mes (YYYY-MM)
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    counts[key] = (counts[key] || 0) + 1;
  });
  // Ordenar por fecha ascendente
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month, value }));
}

const EvolucionExpedientesPage: React.FC = () => {
  const [data, setData] = useState<{ month: string, value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const expedientes = await expedienteService.getAll();
        const chartData = groupByMonth(expedientes);
        setData(chartData);
      } catch (err: any) {
        setError('Error al cargar la evolución de expedientes');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Tooltip personalizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <Paper elevation={6} sx={{ p: 2, background: 'rgba(40,40,40,0.95)', color: '#fff', minWidth: 120, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#ffd600' }}>{d.month}</Typography>
          <Typography variant="body2"><b>Expedientes:</b> {d.value}</Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3e9f7 0%, #f5f7fa 100%)',
      py: { xs: 2, md: 6 },
      px: { xs: 0, md: 4 },
      transition: 'background 0.5s'
    }}>
      {/* Título y subtítulo */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
        <TimelineIcon sx={{ color: '#1976d2', fontSize: 40, mr: 1 }} />
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mr: 2 }}>
          Evolución temporal de expedientes
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ color: '#555', mb: 4 }}>
        Cantidad de expedientes cargados en el sistema agrupados por mes de creación
      </Typography>
      {/* Contenido principal */}
      <Paper elevation={0} sx={{
        p: 4,
        borderRadius: 4,
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)',
        mb: 4,
        minHeight: 420
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : data.length === 0 ? (
          <Typography variant="h6" color="textSecondary" align="center">
            No hay expedientes registrados en el sistema.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 40, left: 40, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#888" fontSize={15} angle={-35} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} stroke="#888" fontSize={15} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(25, 118, 210, 0.08)' }} />
              <Line type="monotone" dataKey="value" stroke="#1976d2" strokeWidth={3} dot={{ r: 6, fill: '#ffd600', stroke: '#1976d2', strokeWidth: 2 }} activeDot={{ r: 10, fill: '#ffd600', stroke: '#1976d2', strokeWidth: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
};

export default EvolucionExpedientesPage; 