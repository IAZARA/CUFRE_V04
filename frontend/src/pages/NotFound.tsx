import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { SentimentVeryDissatisfied as SadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

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
          <SadIcon color="action" sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Página no encontrada
          </Typography>
          <Typography variant="h1" sx={{ color: 'text.secondary', fontWeight: 'bold', mb: 2 }}>
            404
          </Typography>
          <Typography variant="body1" paragraph>
            La página que está buscando no existe o ha sido movida.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 2 }}
          >
            Volver al Inicio
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default NotFound; 