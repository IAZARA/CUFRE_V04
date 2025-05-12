import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  ButtonBase,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Folder as FolderIcon,
  Gavel as GavelIcon,
  BarChart as BarChartIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  CalendarToday as CalendarTodayIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import estadisticaService from '../api/estadisticaService';
import expedienteService from '../api/expedienteService';
import delitoService from '../api/delitoService';
import { useAuth } from '../context/AuthContext';
import CountUp from 'react-countup';

interface DashboardStat {
  title: string;
  value: number;
  description: string;
  color: string;
  icon: React.ReactNode;
  path: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<any>(null);
  const [expedientesRecientes, setExpedientesRecientes] = useState<any[]>([]);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [fechaHora, setFechaHora] = useState(new Date());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // En una implementación real, se obtendría esta información del backend
        const dashboardData = await estadisticaService.getDashboardData();
        setStats(dashboardData);
        
        // Obtener los últimos expedientes
        const expedientes = await expedienteService.getAll();
        setExpedientesRecientes(expedientes.slice(0, 5)); // Mostrar solo los 5 más recientes
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setFechaHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Datos simulados para cuando la API no está disponible
  const mockStats: DashboardStat[] = [
    {
      title: 'Expedientes',
      value: stats?.totalExpedientes ?? 1256,
      description: 'Total de expedientes en el sistema',
      color: '#1976d2',
      icon: <FolderIcon />,
      path: '/expedientes'
    },
    {
      title: 'Delitos',
      value: stats?.totalDelitos ?? 87,
      description: 'Tipos de delitos registrados',
      color: '#dc004e',
      icon: <GavelIcon />,
      path: '/delitos'
    },
    {
      title: 'Usuarios',
      value: stats?.totalUsuarios ?? 120,
      description: 'Usuarios con acceso al sistema',
      color: '#ff9800',
      icon: <PersonIcon />,
      path: '/usuarios'
    },
    {
      title: 'Personas',
      value: stats?.totalPersonas ?? 3254,
      description: 'Personas vinculadas a expedientes',
      color: '#4caf50',
      icon: <PersonIcon />,
      path: '/personas'
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // Saludo dinámico según la hora
  const getSaludo = () => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) return 'Buen día';
    if (hora >= 12 && hora < 19) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* NUEVO: Saludo y fecha/hora en tarjetas */}
      <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        {/* Tarjeta de saludo */}
        <Paper elevation={3} sx={{ p: 3, width: '100%', textAlign: 'center', mb: 2, bgcolor: '#f5faff' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {getSaludo()}, <span style={{ color: '#1976d2' }}>{user?.nombre}</span>.
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Aquí tienes un resumen del sistema.
          </Typography>
        </Paper>
        {/* Tarjeta de fecha y hora */}
        <Paper elevation={1} sx={{ p: 2, width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon color="primary" />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {fechaHora.toLocaleDateString('es-AR', { weekday: 'long' }).charAt(0).toUpperCase() +
                fechaHora.toLocaleDateString('es-AR', { weekday: 'long' }).slice(1)}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon color="primary" />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {fechaHora.toLocaleDateString()}
            </Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon color="primary" />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {fechaHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
            </Typography>
          </Box>
        </Paper>
      </Box>
      {/* FIN NUEVO */}

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4, justifyContent: 'center' }}>
        {mockStats.map((stat, index) => (
          <Box key={index} sx={{ width: { xs: '100%', sm: '47%', md: '22%' } }}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                borderLeft: `4px solid ${stat.color}`,
                userSelect: 'none',
                boxShadow: 2,
                transition: 'box-shadow 0.3s',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ 
                  borderRadius: '50%', 
                  bgcolor: `${stat.color}20`, 
                  p: 1, 
                  display: 'flex',
                  color: stat.color 
                }}>
                  {stat.icon}
                </Box>
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                  {stat.title}
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                <CountUp end={stat.value} duration={1.2} />
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {stat.description}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard; 