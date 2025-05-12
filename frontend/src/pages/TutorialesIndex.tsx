import React from 'react';
import { Box, Typography, Paper, Card, CardActionArea, CardContent, Avatar } from '@mui/material';
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
      <Box maxWidth="1100px" mx="auto">
        <Paper elevation={5} sx={{ borderRadius: 5, p: 5, mb: 4, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(8px)' }}>
          <Typography variant="h3" fontWeight={800} color="#222" mb={1} textAlign="center">
            TUTORIALES
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 4,
              justifyItems: 'center',
              alignItems: 'center',
              mt: 4,
              width: '100%',
              maxWidth: '1000px',
              mx: 'auto',
            }}
          >
            {tutoriales.map((tut) => (
              <Card
                key={tut.titulo}
                elevation={0}
                sx={{
                  borderRadius: 4,
                  width: '100%',
                  minWidth: 220,
                  maxWidth: 270,
                  minHeight: 240,
                  height: 240,
                  background: 'rgba(255,255,255,0.85)',
                  boxShadow: '0 4px 24px 0 rgba(30, 136, 229, 0.08)',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.04)',
                    boxShadow: '0 8px 32px 0 rgba(30, 136, 229, 0.18)',
                    background: 'rgba(255,255,255,0.97)'
                  }
                }}
              >
                <CardActionArea onClick={() => navigate(tut.ruta)} sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                  <Avatar sx={{ bgcolor: 'transparent', width: 64, height: 64, mb: 2, boxShadow: '0 2px 8px #bbb' }}>
                    {tut.icono}
                  </Avatar>
                  <CardContent sx={{ textAlign: 'center', p: 0 }}>
                    <Typography variant="h6" fontWeight={700} color="#222" mb={1}>
                      {tut.titulo}
                    </Typography>
                    <Typography variant="body2" color="#555">
                      {tut.descripcion}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default TutorialesIndex; 