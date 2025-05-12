import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Drawer,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Avatar,
  Typography,
  Button
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import PieChartOutlineRoundedIcon from '@mui/icons-material/PieChartOutlineRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import GavelIcon from '@mui/icons-material/Gavel';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Rol } from '../../types/usuario.types';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface SidebarProps {
  open: boolean;
  handleDrawerClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, handleDrawerClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [expedientesOpen, setExpedientesOpen] = useState(false);
  const [delitosOpen, setDelitosOpen] = useState(false);
  const [estadisticasOpen, setEstadisticasOpen] = useState(false);
  const [masBuscadosOpen, setMasBuscadosOpen] = useState(false);

  const handleExpedientesClick = () => {
    setExpedientesOpen(!expedientesOpen);
  };

  const handleDelitosClick = () => {
    setDelitosOpen(!delitosOpen);
  };

  const handleEstadisticasClick = () => {
    setEstadisticasOpen(!estadisticasOpen);
  };

  const handleMasBuscadosClick = () => {
    setMasBuscadosOpen(!masBuscadosOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  // Helpers de visibilidad por rol
  const isSuper = user?.rol === Rol.SUPERUSUARIO;
  const isAdmin = user?.rol === Rol.ADMINISTRADOR;
  const isCarga = user?.rol === Rol.USUARIOCARGA;
  const isConsulta = user?.rol === Rol.USUARIOCONSULTA;

  // Función para saber si el usuario puede ver un menú
  const canSee = (menu: string) => {
    if (isSuper) return true;
    if (isAdmin) {
      if (menu === 'usuarios') return false;
      return true;
    }
    if (isCarga) {
      if (menu === 'usuarios' || menu === 'actividad' || menu === 'crear-delito') return false;
      return true;
    }
    if (isConsulta) {
      return ['consulta', 'estadisticas', 'masbuscados', 'soporte'].includes(menu);
    }
    return false;
  };

  return (
    <Drawer
      className="no-print"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1c2536',
          color: '#fff',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose} sx={{ color: '#fff' }}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      {user && (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            {user.nombre}
          </Typography>
          <Button variant="outlined" color="error" size="small" onClick={logout}>
            Cerrar sesión
          </Button>
        </Box>
      )}
      <List>
        {/* Dashboard */}
        {canSee('dashboard') && (
        <ListItem disablePadding>
          <ListItemButton 
            selected={location.pathname === '/dashboard'}
            onClick={() => handleNavigation('/dashboard')}
            sx={{
              borderRadius: 2,
              mb: 1,
              px: 2,
              py: 1.5,
              color: '#fff',
              backgroundColor: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
              <SpaceDashboardRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
          </ListItemButton>
        </ListItem>
        )}

        {/* Consulta */}
        {canSee('consulta') && (
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/consulta'}
            onClick={() => handleNavigation('/consulta')}
            sx={{
              borderRadius: 2,
              mb: 1,
              px: 2,
              py: 1.5,
              color: '#fff',
              backgroundColor: location.pathname === '/consulta' ? 'rgba(255,255,255,0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
              <SearchIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Consulta" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
          </ListItemButton>
        </ListItem>
        )}

        {/* Expedientes (expandible) */}
        {canSee('expedientes') && (
        <ListItem disablePadding>
          <ListItemButton onClick={handleExpedientesClick} sx={{ borderRadius: 2, mb: 1, px: 2, py: 1.5 }}>
            <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
              <FolderOpenRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Expedientes" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            {expedientesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        )}
        {canSee('expedientes') && (
        <Collapse in={expedientesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/expedientes'}
              onClick={() => handleNavigation('/expedientes')}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <DescriptionRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Lista Expedientes" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            </ListItemButton>
            <ListItemButton 
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/expedientes/crear'}
              onClick={() => handleNavigation('/expedientes/crear')}
              disabled={isConsulta}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <NoteAddRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Crear Expediente" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            </ListItemButton>
          </List>
        </Collapse>
        )}

        {/* Más Buscados (expandible) */}
        {canSee('masbuscados') && (
        <ListItem disablePadding>
          <ListItemButton onClick={handleMasBuscadosClick} sx={{ borderRadius: 2, mb: 1, px: 2, py: 1.5 }}>
            <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
              <PersonSearchRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Más Buscados" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            {masBuscadosOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        )}
        {canSee('masbuscados') && (
        <Collapse in={masBuscadosOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/expedientes/cufre'}
              onClick={() => handleNavigation('/expedientes/cufre')}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <PersonSearchRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="CUFRE" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              onClick={() => window.open('https://www.interpol.int/es/Como-trabajamos/Notificaciones/Notificaciones-rojas/Ver-las-notificaciones-rojas', '_blank')}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <GroupRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="INTERPOOL" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/expedientes/iterar-mas-buscados'}
              onClick={() => handleNavigation('/expedientes/iterar-mas-buscados')}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <PersonSearchRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Iterar Más Buscados" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            </ListItemButton>
          </List>
        </Collapse>
        )}

        {/* Delitos (expandible) */}
        {canSee('delitos') && (
        <ListItem disablePadding>
          <ListItemButton onClick={handleDelitosClick} sx={{ borderRadius: 2, mb: 1, px: 2, py: 1.5 }}>
            <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
              <GavelRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Delitos" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            {delitosOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        )}
        {canSee('delitos') && (
        <Collapse in={delitosOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/delitos'}
              onClick={() => handleNavigation('/delitos')}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <GavelRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Lista Delitos" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            </ListItemButton>
            {canSee('crear-delito') && (
            <ListItemButton 
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/delitos/crear'}
              onClick={() => handleNavigation('/delitos/crear')}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <NoteAddRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Crear Delito" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            </ListItemButton>
            )}
          </List>
        </Collapse>
        )}

        {/* Estadísticas (expandible) */}
        {canSee('estadisticas') && (
        <ListItem disablePadding>
          <ListItemButton onClick={handleEstadisticasClick} sx={{ borderRadius: 2, mb: 1, px: 2, py: 1.5 }}>
            <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
              <BarChartRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Estadísticas" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            {estadisticasOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        )}
        {canSee('estadisticas') && (
        <Collapse in={estadisticasOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/estadisticas'}
              onClick={() => handleNavigation('/estadisticas')}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <PieChartOutlineRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Gráficos" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/estadisticas/mapa'}
              onClick={() => handleNavigation('/estadisticas/mapa')}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <PlaceRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Mapa" primaryTypographyProps={{ fontSize: 15 }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/estadisticas/detenidos-por-fuerza'}
              onClick={() => handleNavigation('/estadisticas/detenidos-por-fuerza')}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <BarChartRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Detenidos por Fuerza" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/estadisticas/evolucion-expedientes'}
              onClick={() => handleNavigation('/estadisticas/evolucion-expedientes')}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <TimelineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Evolución de Expedientes" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/estadisticas/ranking-delitos'}
              onClick={() => handleNavigation('/estadisticas/ranking-delitos')}
            >
              <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
                <GavelIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Ranking de Delitos" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
            </ListItemButton>
          </List>
        </Collapse>
        )}

        {/* Usuarios */}
        {canSee('usuarios') && (
        <ListItem disablePadding>
          <ListItemButton 
            selected={location.pathname.startsWith('/usuarios')}
            onClick={() => handleNavigation('/usuarios')}
            sx={{ borderRadius: 2, mb: 1, px: 2, py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
              <GroupRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Usuarios" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
          </ListItemButton>
        </ListItem>
        )}

        {/* Tutoriales */}
        {canSee('tutoriales') && (
        <ListItem disablePadding>
          <ListItemButton 
            selected={location.pathname.startsWith('/tutoriales')}
            onClick={() => handleNavigation('/tutoriales')}
            sx={{
              borderRadius: 2,
              mb: 1,
              px: 2,
              py: 1.5,
              color: '#fff',
              backgroundColor: location.pathname.startsWith('/tutoriales') ? 'rgba(255,255,255,0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
              <SchoolIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Tutoriales" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
          </ListItemButton>
        </ListItem>
        )}

        {/* Soporte */}
        {canSee('soporte') && (
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/soporte'}
            onClick={() => handleNavigation('/soporte')}
            sx={{
              borderRadius: 2,
              mb: 1,
              px: 2,
              py: 1.5,
              color: '#fff',
              backgroundColor: location.pathname === '/soporte' ? 'rgba(255,255,255,0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
              <HelpOutlineRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Soporte" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
          </ListItemButton>
        </ListItem>
        )}

        {/* Actividad del Sistema */}
        {canSee('actividad') && (
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === '/actividad-sistema'}
            onClick={() => handleNavigation('/actividad-sistema')}
            sx={{
              borderRadius: 2,
              mb: 1,
              px: 2,
              py: 1.5,
              color: '#fff',
              backgroundColor: location.pathname === '/actividad-sistema' ? 'rgba(255,255,255,0.08)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: '#fff'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#fff', minWidth: 0, mr: 2 }}>
              <BarChartRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Actividad del Sistema" primaryTypographyProps={{ fontWeight: 500, color: '#fff' }} />
          </ListItemButton>
        </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar; 