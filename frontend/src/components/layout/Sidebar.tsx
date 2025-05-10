import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
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
  const theme = useTheme();
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
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        {/* Expedientes (expandible) */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleExpedientesClick}>
            <ListItemIcon>
              <FolderIcon />
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
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Listar Expedientes" />
            </ListItemButton>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={location.pathname === '/expedientes/crear'}
              onClick={() => handleNavigation('/expedientes/crear')}
            >
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Crear Expediente" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Delitos (expandible) */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleDelitosClick}>
            <ListItemIcon>
              <GavelIcon />
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
              <ListItemIcon>
                <GavelIcon />
              </ListItemIcon>
              <ListItemText primary="Listar Delitos" />
            </ListItemButton>
            <ListItemButton 
              sx={{ pl: 4 }}
              selected={location.pathname === '/delitos/crear'}
              onClick={() => handleNavigation('/delitos/crear')}
            >
              <ListItemIcon>
                <GavelIcon />
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
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Estadísticas" />
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