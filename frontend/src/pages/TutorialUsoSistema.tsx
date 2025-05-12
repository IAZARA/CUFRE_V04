import { Box, Typography, Paper, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function TutorialUsoSistema() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4, background: 'linear-gradient(90deg, #d32f2f 0%, #ff7961 100%)', color: '#fff', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <HelpOutlineIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Uso del Sistema
          </Typography>
        </Box>
        <Typography variant="subtitle1">
          Descubre las funcionalidades principales del sistema y cómo aprovecharlas al máximo.
        </Typography>
      </Paper>
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Funcionalidades principales
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Consulta expedientes y personas desde la sección de Consulta." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Gestiona expedientes: crea, edita y visualiza detalles completos." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Asocia documentos, fotografías y personas a cada expediente." />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText primary="Genera reportes y consulta estadísticas desde la sección correspondiente." />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
} 