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
      value: 1256,
      description: 'Total de expedientes en el sistema',
      color: '#1976d2',
      icon: <FolderIcon />,
      path: '/expedientes'
    },
    {
      title: 'Delitos',
      value: 87,
      description: 'Tipos de delitos registrados',
      color: '#dc004e',
      icon: <GavelIcon />,
      path: '/delitos'
    },
    {
      title: 'Estadísticas',
      value: 42,
      description: 'Informes disponibles',
      color: '#ff9800',
      icon: <BarChartIcon />,
      path: '/estadisticas'
    },
    {
      title: 'Personas',
      value: 3254,
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ m: 0 }}>
          {getSaludo()}, {user?.nombre}.
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 500, color: 'primary.main' }}>
            <CalendarTodayIcon sx={{ mr: 1, fontSize: 28 }} />
            {fechaHora.toLocaleDateString()}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', fontSize: 22, fontWeight: 500, color: 'primary.main' }}>
            <AccessTimeIcon sx={{ mr: 1, fontSize: 28 }} />
            {fechaHora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
          </Box>
        </Box>
      </Box>
      <Typography variant="subtitle1" color="textSecondary" paragraph>
        Aquí tienes un resumen del sistema.
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 4 }}>
        {mockStats.map((stat, index) => (
          <Box key={index} sx={{ width: { xs: '100%', sm: '47%', md: '22%' } }}>
            <ButtonBase 
              sx={{ width: '100%', textAlign: 'left' }}
              onClick={() => handleNavigate(stat.path)}
            >
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  borderLeft: `4px solid ${stat.color}`,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
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
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {stat.description}
                </Typography>
              </Paper>
            </ButtonBase>
          </Box>
        ))}
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Expedientes Recientes
      </Typography>
      <Divider sx={{ mb: 2 }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {expedientesRecientes.length > 0 ? (
          expedientesRecientes.map((expediente, index) => (
            <Box key={index} sx={{ width: { xs: '100%', sm: '47%', md: '31%' } }}>
              <Card>
                <CardActionArea onClick={() => handleNavigate(`/expedientes/editar/${expediente.id}`)}>
                  <CardContent>
                    <Typography variant="h6" component="div" noWrap>
                      {expediente.caratula}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Expediente Nº: {expediente.numero}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="textSecondary">
                        {expediente.estado}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {expediente.fechaIngreso}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Box>
          ))
        ) : (
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                No hay expedientes recientes para mostrar.
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <ButtonBase onClick={() => handleNavigate('/expedientes')}>
          <Paper sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            '&:hover': { bgcolor: 'action.hover' } 
          }}>
            <Typography variant="button" sx={{ mr: 1 }}>
              Ver todos los expedientes
            </Typography>
            <ArrowForwardIcon fontSize="small" />
          </Paper>
        </ButtonBase>
      </Box>
    </Box>
  );
};

export default Dashboard; 