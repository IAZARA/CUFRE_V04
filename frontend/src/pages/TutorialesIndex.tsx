import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemButton } from '@mui/material';
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded';
import FunctionsRoundedIcon from '@mui/icons-material/FunctionsRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import { useNavigate } from 'react-router-dom';

const tutoriales = [
  {
    titulo: 'CREACIÓN DE EXPEDIENTE',
    descripcion: 'Aprende cómo crear un nuevo expediente en el sistema.',
    icono: <NoteAddRoundedIcon fontSize="large" sx={{ color: '#1976d2' }} />,
    ruta: '/tutoriales/creacion-expediente'
  },
  {
    titulo: 'CÁLCULO DE PRIORIDAD',
    descripcion: 'Descubre cómo se calcula la prioridad de un expediente.',
    icono: <FunctionsRoundedIcon fontSize="large" sx={{ color: '#388e3c' }} />,
    ruta: '/tutoriales/calculo-prioridad'
  },
  {
    titulo: 'CREACIÓN DE DELITO',
    descripcion: 'Guía para registrar un nuevo delito en el sistema.',
    icono: <GavelRoundedIcon fontSize="large" sx={{ color: '#d32f2f' }} />,
    ruta: '/tutoriales/creacion-delito'
  },
  {
    titulo: 'USO DEL SISTEMA',
    descripcion: 'Consejos y mejores prácticas para navegar y operar el sistema.',
    icono: <HelpOutlineRoundedIcon fontSize="large" sx={{ color: '#ffd600' }} />,
    ruta: '/tutoriales/uso-sistema'
  }
];

const TutorialesIndex = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', py: 8 }}>
      <Box maxWidth="700px" mx="auto">
        <Paper elevation={5} sx={{ borderRadius: 5, p: 5, mb: 4, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
          <Typography variant="h3" fontWeight={800} color="#222" mb={3} textAlign="center">
            TUTORIALES
          </Typography>
          <List sx={{ width: '100%' }}>
            {tutoriales.map((tut) => (
              <ListItem key={tut.titulo} disablePadding sx={{ mb: 2, borderRadius: 3, overflow: 'hidden', boxShadow: '0 2px 8px #e3e3e3' }}>
                <ListItemButton onClick={() => navigate(tut.ruta)} sx={{ py: 3 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: 'transparent', width: 56, height: 56, mr: 2, boxShadow: '0 2px 8px #bbb' }}>
                      {tut.icono}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={<Typography variant="h6" fontWeight={700} color="#222">{tut.titulo}</Typography>}
                    secondary={<Typography variant="body2" color="#555">{tut.descripcion}</Typography>}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Box>
  );
};

export default TutorialesIndex; 