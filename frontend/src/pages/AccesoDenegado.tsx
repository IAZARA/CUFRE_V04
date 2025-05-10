import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AccesoDenegado: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleVolver = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <ErrorIcon color="error" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Acceso Denegado
          </Typography>
          <Typography variant="body1" paragraph>
            No tiene los permisos necesarios para acceder a esta sección.
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Su rol actual es: <strong>{user?.rol || 'No disponible'}</strong>
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Si cree que debería tener acceso a esta sección, por favor contacte al administrador del sistema.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleVolver}
            sx={{ mt: 2 }}
          >
            Volver al Dashboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default AccesoDenegado; 