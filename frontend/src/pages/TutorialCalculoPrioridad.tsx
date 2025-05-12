import { Box, Typography, Paper, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function TutorialCalculoPrioridad() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(90deg, #388e3c 0%, #81c784 100%)', color: '#fff', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <TrendingUpIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Cálculo de Prioridad
          </Typography>
        </Box>
        <Typography variant="subtitle1">
          Descubre cómo el sistema asigna la prioridad a cada expediente.
        </Typography>
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          ¿Cómo se calcula la prioridad?
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="El sistema analiza los datos ingresados: peligrosidad, reincidencia, tipo de delito, etc." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="La prioridad se calcula automáticamente al guardar o actualizar el expediente." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Puedes consultar la prioridad en la ficha de cada expediente." />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
} 