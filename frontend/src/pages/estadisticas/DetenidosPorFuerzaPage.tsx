import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Avatar
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import expedienteService from '../../api/expedienteService';

// Mapeo de logos de fuerza (igual que en ExpedienteDetallePage)
const fuerzaIconos: Record<string, { src: string; alt: string }> = {
  PFA: { src: '/images/icon1.png', alt: 'Policía Federal Argentina' },
  GNA: { src: '/images/Insignia_de_la_Gendarmería_de_Argentina.svg.png', alt: 'Gendarmería Nacional Argentina' },
  PNA: { src: '/images/icon3.png', alt: 'Prefectura Naval Argentina' },
  PSA: { src: '/images/icon4.png', alt: 'Policía de Seguridad Aeroportuaria' },
  INTERPOOL: { src: '/images/interpol.png', alt: 'Interpol' },
  SPF: { src: '/images/Logo_SPF.png', alt: 'Servicio Penitenciario Federal' },
  CUFRE: { src: '/images/logo-cufre-2.png', alt: 'CUFRE' },
};

const COLORS = [
  '#1976d2', // PFA
  '#388e3c', // GNA
  '#bfa16c', // PNA
  '#222',    // PSA
  '#8e24aa', // INTERPOOL
  '#4fc3f7', // SPF
  '#ffd600', // CUFRE
  '#757575'  // fallback
];

const DetenidosPorFuerzaPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const expedientes = await expedienteService.getAll();
        // Filtrar solo los expedientes en estado DETENIDO
        const detenidos = expedientes.filter((exp: any) => (exp.estadoSituacion || '').toUpperCase() === 'DETENIDO');
        // Agrupar por fuerza asignada
        const agrupados: Record<string, number> = {};
        detenidos.forEach((exp: any) => {
          const fuerza = (exp.fuerzaAsignada || 'SIN DATO').toUpperCase();
          agrupados[fuerza] = (agrupados[fuerza] || 0) + 1;
        });
        // Convertir a array para el gráfico
        const chartData = Object.entries(agrupados).map(([fuerza, value], idx) => ({
          fuerza,
          value,
          logo: fuerzaIconos[fuerza]?.src,
          alt: fuerzaIconos[fuerza]?.alt,
          color: COLORS[idx % COLORS.length]
        }));
        setData(chartData);
      } catch (err: any) {
        setError('Error al cargar los datos de detenidos por fuerza');
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
        <Paper elevation={6} sx={{ p: 2, background: 'rgba(40,40,40,0.95)', color: '#fff', border: `2px solid ${d.color}`, minWidth: 170, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" mb={1}>
            {d.logo && <Avatar src={d.logo} alt={d.alt} sx={{ width: 32, height: 32, mr: 1, bgcolor: '#fff' }} />}
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: d.color }}>{d.fuerza}</Typography>
          </Box>
          <Typography variant="body2"><b>Detenidos:</b> {d.value}</Typography>
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
        <BarChartIcon sx={{ color: '#1976d2', fontSize: 40, mr: 1 }} />
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1976d2', mr: 2 }}>
          Detenidos por Fuerza
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ color: '#555', mb: 4 }}>
        Cantidad de expedientes en estado <b>DETENIDO</b> agrupados por fuerza asignada
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
            No hay detenidos registrados en el sistema.
          </Typography>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
              barCategoryGap={32}
            >
              <XAxis type="number" allowDecimals={false} stroke="#888" fontSize={15} />
              <YAxis
                dataKey="fuerza"
                type="category"
                tick={({ x, y, payload }) => {
                  const d = data.find(f => f.fuerza === payload.value);
                  return (
                    <g transform={`translate(${x - 55},${y})`}>
                      {d?.logo && <image href={d.logo} x={-38} y={-16} height={32} width={32} style={{ filter: 'drop-shadow(0 2px 6px #aaa)' }} />}
                      <text x={0} y={0} dy={8} fill="#222" fontWeight="bold" fontSize={17}>{payload.value}</text>
                    </g>
                  );
                }}
                width={180}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(25, 118, 210, 0.08)' }} />
              <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                {data.map((entry, idx) => (
                  <Cell key={`bar-${entry.fuerza}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Paper>
    </Box>
  );
};

export default DetenidosPorFuerzaPage; 