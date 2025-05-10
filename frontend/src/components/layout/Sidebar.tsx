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
  Collapse
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Description as DescriptionIcon,
  Gavel as GavelIcon,
  BarChart as BarChartIcon,
  People as PeopleIcon,
  ExpandLess,
  ExpandMore,
  Folder as FolderIcon
} from '@mui/icons-material';
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
  const { user } = useAuth();
  
  const [expedientesOpen, setExpedientesOpen] = useState(false);
  const [delitosOpen, setDelitosOpen] = useState(false);

  const handleExpedientesClick = () => {
    setExpedientesOpen(!expedientesOpen);
  };

  const handleDelitosClick = () => {
    setDelitosOpen(!delitosOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton 
            selected={location.pathname === '/dashboard'}
            onClick={() => handleNavigation('/dashboard')}
          >
            <ListItemIcon sx={{ color: '#1976d2' }}>
              <DashboardIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {/* Expedientes (expandible) */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleExpedientesClick}>
            <ListItemIcon sx={{ color: '#ff9800' }}>
              <FolderIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Expedientes" />
            {expedientesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={expedientesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={location.pathname === '/expedientes'}
              onClick={() => handleNavigation('/expedientes')}
            >
              <ListItemIcon sx={{ color: '#4caf50' }}>
                <DescriptionIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText primary="Lista Expedientes" />
            </ListItemButton>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={location.pathname === '/expedientes/crear'}
              onClick={() => handleNavigation('/expedientes/crear')}
            >
              <ListItemIcon sx={{ color: '#4caf50' }}>
                <DescriptionIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText primary="Crear Expediente" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Delitos (expandible) */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleDelitosClick}>
            <ListItemIcon sx={{ color: '#e91e63' }}>
              <GavelIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Delitos" />
            {delitosOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={delitosOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={location.pathname === '/delitos'}
              onClick={() => handleNavigation('/delitos')}
            >
              <ListItemIcon sx={{ color: '#9c27b0' }}>
                <GavelIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText primary="Lista Delitos" />
            </ListItemButton>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={location.pathname === '/delitos/crear'}
              onClick={() => handleNavigation('/delitos/crear')}
            >
              <ListItemIcon sx={{ color: '#9c27b0' }}>
                <GavelIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText primary="Crear Delito" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Estadísticas */}
        <ListItem disablePadding>
          <ListItemButton 
            selected={location.pathname === '/estadisticas'}
            onClick={() => handleNavigation('/estadisticas')}
          >
            <ListItemIcon sx={{ color: '#00bcd4' }}>
              <BarChartIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Estadísticas" />
          </ListItemButton>
        </ListItem>

        {/* Más Buscados */}
        <ListItem disablePadding>
          <ListItemButton 
            selected={location.pathname === '/mas-buscados'}
            onClick={() => handleNavigation('/mas-buscados')}
          >
            <ListItemIcon sx={{ color: '#f44336' }}>
              <PeopleIcon fontSize="large" />
            </ListItemIcon>
            <ListItemText primary="Más Buscados" />
          </ListItemButton>
        </ListItem>

        {/* Usuarios (solo para administradores) */}
        {user && (user.rol === Rol.ADMINISTRADOR || user.rol === Rol.SUPERUSUARIO) && (
          <ListItem disablePadding>
            <ListItemButton 
              selected={location.pathname.startsWith('/usuarios')}
              onClick={() => handleNavigation('/usuarios')}
            >
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Usuarios" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar; 