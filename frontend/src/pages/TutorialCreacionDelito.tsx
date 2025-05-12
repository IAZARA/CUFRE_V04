import { Box, Typography, Paper, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function TutorialCreacionDelito() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(90deg, #fbc02d 0%, #fff176 100%)', color: '#333', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <GavelIcon sx={{ fontSize: 40, mr: 2, color: '#333' }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Creación de Delito
          </Typography>
        </Box>
        <Typography variant="subtitle1">
          Aprende cómo asociar delitos a un expediente de manera sencilla.
        </Typography>
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Pasos para asociar un delito
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Abre el expediente al que deseas asociar un delito." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Dirígete a la pestaña 'Delitos'." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Busca y selecciona el delito correspondiente." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Guarda los cambios para asociar el delito al expediente." />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
} 