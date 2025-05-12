import { Box, Typography, Paper, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function TutorialCreacionExpediente() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)', color: '#fff', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AssignmentIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Creación de Expediente
          </Typography>
        </Box>
        <Typography variant="subtitle1">
          Aprende cómo crear un expediente en el sistema paso a paso.
        </Typography>
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Pasos para crear un expediente
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Haz clic en 'Crear Expediente' en el menú lateral." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Completa los campos obligatorios del formulario." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Presiona el botón 'Crear expediente' para guardar." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="A partir de ese momento, podrás asociar documentos, fotos y personas." />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
} 