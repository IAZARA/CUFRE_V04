import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const SoportePage = () => {
  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: 5 }}>
        <img
          src="/images/escudo HD.png"
          alt="Escudo Dirección Nacional"
          style={{ width: 160, height: 160, objectFit: 'contain', marginBottom: 0 }}
        />
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h5" color="#1976d2" fontWeight={700} mb={3}>
            Si necesita ayuda o tiene algún inconveniente con el sistema,<br />por favor contáctese con:
          </Typography>
          <Typography variant="h5" fontWeight={800} color="#1976d2" mb={1}>
            Dirección Nacional de Gestión de Bases de Datos de Seguridad
          </Typography>
          <Typography variant="h6" fontWeight={600} color="#222" mb={1}>
            Subsecretaría de Investigación Criminal
          </Typography>
          <Typography variant="body1" color="#222" mb={1}>
            Chile 760 - 1º Piso - CABA
          </Typography>
          <Typography variant="h6" fontWeight={900} color="#222" mb={1}>
            Tel: (011) 5278 - 9800 (int. 3464)
          </Typography>
          <Typography variant="h6" fontWeight={700} color="#1976d2">
            Email: <Link href="mailto:soporte.cufre@gmail.com" color="#1976d2" underline="hover">soporte.cufre@gmail.com</Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SoportePage; 