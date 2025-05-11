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
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import FolderOpenRoundedIcon from '@mui/icons-material/FolderOpenRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
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
            sx={{
              borderRadius: 2,
              mb: 1,
              px: 2,
              py: 1.5,
              color: location.pathname === '/dashboard' ? 'primary.main' : 'text.secondary',
              backgroundColor: location.pathname === '/dashboard' ? 'primary.50' : 'transparent',
              '&:hover': {
                backgroundColor: 'primary.100',
                color: 'primary.main'
              }
            }}
          >
            <ListItemIcon sx={{ color: 'inherit', minWidth: 0, mr: 2 }}>
              <SpaceDashboardRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>

        {/* Expedientes (expandible) */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleExpedientesClick} sx={{ borderRadius: 2, mb: 1, px: 2, py: 1.5 }}>
            <ListItemIcon sx={{ color: '#ff9800', minWidth: 0, mr: 2 }}>
              <FolderOpenRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Expedientes" primaryTypographyProps={{ fontWeight: 500 }} />
            {expedientesOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={expedientesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/expedientes'}
              onClick={() => handleNavigation('/expedientes')}
            >
              <ListItemIcon sx={{ color: '#4caf50', minWidth: 0, mr: 2 }}>
                <DescriptionRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Lista Expedientes" />
            </ListItemButton>
            <ListItemButton 
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/expedientes/crear'}
              onClick={() => handleNavigation('/expedientes/crear')}
            >
              <ListItemIcon sx={{ color: '#4caf50', minWidth: 0, mr: 2 }}>
                <NoteAddRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Crear Expediente" />
            </ListItemButton>
          </List>
        </Collapse>

        {/* Delitos (expandible) */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleDelitosClick} sx={{ borderRadius: 2, mb: 1, px: 2, py: 1.5 }}>
            <ListItemIcon sx={{ color: '#e91e63', minWidth: 0, mr: 2 }}>
              <GavelRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Delitos" primaryTypographyProps={{ fontWeight: 500 }} />
            {delitosOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={delitosOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton 
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/delitos'}
              onClick={() => handleNavigation('/delitos')}
            >
              <ListItemIcon sx={{ color: '#9c27b0', minWidth: 0, mr: 2 }}>
                <GavelRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Lista Delitos" />
            </ListItemButton>
            <ListItemButton 
              sx={{ pl: 5, borderRadius: 2, mb: 1 }}
              selected={location.pathname === '/delitos/crear'}
              onClick={() => handleNavigation('/delitos/crear')}
            >
              <ListItemIcon sx={{ color: '#9c27b0', minWidth: 0, mr: 2 }}>
                <NoteAddRoundedIcon fontSize="small" />
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
            sx={{ borderRadius: 2, mb: 1, px: 2, py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#00bcd4', minWidth: 0, mr: 2 }}>
              <BarChartRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Estadísticas" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>

        {/* Más Buscados */}
        <ListItem disablePadding>
          <ListItemButton 
            selected={location.pathname === '/mas-buscados'}
            onClick={() => handleNavigation('/mas-buscados')}
            sx={{ borderRadius: 2, mb: 1, px: 2, py: 1.5 }}
          >
            <ListItemIcon sx={{ color: '#f44336', minWidth: 0, mr: 2 }}>
              <PersonSearchRoundedIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary="Más Buscados" primaryTypographyProps={{ fontWeight: 500 }} />
          </ListItemButton>
        </ListItem>

        {/* Usuarios (solo para administradores) */}
        {user && (user.rol === Rol.ADMINISTRADOR || user.rol === Rol.SUPERUSUARIO) && (
          <ListItem disablePadding>
            <ListItemButton 
              selected={location.pathname.startsWith('/usuarios')}
              onClick={() => handleNavigation('/usuarios')}
              sx={{ borderRadius: 2, mb: 1, px: 2, py: 1.5 }}
            >
              <ListItemIcon sx={{ color: '#757575', minWidth: 0, mr: 2 }}>
                <GroupRoundedIcon fontSize="medium" />
              </ListItemIcon>
              <ListItemText primary="Usuarios" primaryTypographyProps={{ fontWeight: 500 }} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar; 