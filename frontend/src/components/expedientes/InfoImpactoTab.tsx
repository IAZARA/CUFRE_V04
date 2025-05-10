import React from 'react';
import {
  TextField,
  MenuItem,
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Slider
} from '@mui/material';
import { Expediente } from '../../types/expediente.types';

interface InfoImpactoTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const nivelesImpacto = [
  'Bajo',
  'Medio',
  'Alto',
  'Muy Alto'
];

const ampliacionesCircula = [
  'Local',
  'Provincial',
  'Regional',
  'Nacional',
  'Internacional'
];

const InfoImpactoTab: React.FC<InfoImpactoTabProps> = ({ expediente, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    onChange(name as keyof Expediente, fieldValue);
  };

  const handleSliderChange = (name: string) => (event: Event, newValue: number | number[]) => {
    onChange(name as keyof Expediente, newValue);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" gutterBottom>
        Impacto y Contexto del Caso
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              select
              label="Nivel de Impacto Mediático"
              name="impactoMediatico"
              value={expediente.impactoMediatico || ''}
              onChange={handleChange}
              margin="normal"
            >
              {nivelesImpacto.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              select
              label="Nivel de Impacto Social"
              name="impactoSocial"
              value={expediente.impactoSocial || ''}
              onChange={handleChange}
              margin="normal"
            >
              {nivelesImpacto.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        
        <Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Información de Contexto Adicional"
            name="informacionContextoAdicional"
            value={expediente.informacionContextoAdicional || ''}
            onChange={handleChange}
            margin="normal"
            helperText="Datos relevantes que ayuden a comprender el contexto completo del caso"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InfoImpactoTab; 