import React from 'react';
import {
  TextField,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Tooltip
} from '@mui/material';
import { Expediente } from '../../types/expediente.types';

interface InfoOrganizacionTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const nivelesOrganizacion = [
  'S/D',
  'SIMPLE',
  'COMPLEJA'
];

const ambitosBanda = [
  'S/D',
  'NACIONAL',
  'PROVINCIAL',
  'BARRIAL',
  'INTERNACIONAL'
];

const capacidadesOperativas = [
  'S/D',
  'ALTA',
  'BAJA'
];

const InfoOrganizacionTab: React.FC<InfoOrganizacionTabProps> = ({ expediente, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    onChange(name as keyof Expediente, fieldValue);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Información de la Organización
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.bandaFlag || false}
                  onChange={handleChange}
                  name="bandaFlag"
                />
              }
              label="Pertenece a una Banda/Organización"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.terrorismoFlag || false}
                  onChange={handleChange}
                  name="terrorismoFlag"
                />
              }
              label="Vinculación con Terrorismo"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: expediente.bandaFlag ? 'block' : 'none' }}>
          <TextField
            fullWidth
            label="Nombre de la Banda/Organización"
            name="nombreBanda"
            value={expediente.nombreBanda || ''}
            onChange={handleChange}
            margin="normal"
            size="small"
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ display: expediente.bandaFlag ? 'flex' : 'none', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              select
              label="Nivel de Organización"
              name="nivelOrganizacion"
              value={expediente.nivelOrganizacion || 'S/D'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {nivelesOrganizacion.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              select
              label="Ámbito de la Banda"
              name="ambitoBanda"
              value={expediente.ambitoBanda || 'S/D'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {ambitosBanda.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              select
              label="Capacidad Operativa"
              name="capacidadOperativa"
              value={expediente.capacidadOperativa || 'S/D'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {capacidadesOperativas.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        
        <Box sx={{ display: expediente.bandaFlag ? 'flex' : 'none', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.planificacionFlag || false}
                  onChange={handleChange}
                  name="planificacionFlag"
                />
              }
              label="Evidencia de Planificación"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.patronesRepetitivos || false}
                  onChange={handleChange}
                  name="patronesRepetitivos"
                />
              }
              label="Patrones Repetitivos"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.conexionesOtrasActividadesFlag || false}
                  onChange={handleChange}
                  name="conexionesOtrasActividadesFlag"
                />
              }
              label="Conexiones con Otras Actividades Ilícitas"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default InfoOrganizacionTab; 