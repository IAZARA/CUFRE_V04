import { Link } from 'react-router-dom';
import { Box, Typography, List, ListItemButton, ListItemText } from '@mui/material';

export default function TutorialesIndex() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Tutoriales</Typography>
      <List>
        <ListItemButton component={Link} to="/tutoriales/creacion-expediente">
          <ListItemText primary="Creación de Expediente" />
        </ListItemButton>
        <ListItemButton component={Link} to="/tutoriales/calculo-prioridad">
          <ListItemText primary="Cálculo de Prioridad" />
        </ListItemButton>
        <ListItemButton component={Link} to="/tutoriales/creacion-delito">
          <ListItemText primary="Creación de Delito" />
        </ListItemButton>
        <ListItemButton component={Link} to="/tutoriales/uso-sistema">
          <ListItemText primary="Uso del Sistema" />
        </ListItemButton>
      </List>
    </Box>
  );
} 