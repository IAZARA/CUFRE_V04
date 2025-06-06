import React from 'react';
import {
  TextField,
  MenuItem,
  Box,
  Typography,
  Divider,
  Tooltip
} from '@mui/material';
import { Expediente } from '../../types/expediente.types';

interface InfoImpactoTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const nivelesImpacto = ['ALTO', 'BAJO'];

const nivelesIncidenciaZona = [
  'S/D',
  'ALTA',
  'MEDIA',
  'BAJA'
];

const institucionesSensibles = [
  'S/D',
  'ESCUELA',
  'HOSPITAL',
  'IGLESIA',
  'SINAGOGA',
  'MEZQUITA',
  'OTRO',
  'NINGUNA'
];

const recursosLimitados = [
  'S/D',
  'SI',
  'NO'
];

const areasFronterizas = [
  'S/D',
  'SI',
  'NO'
];

const nivelesPercepcion = [
  'S/D',
  'ALTA',
  'MEDIA',
  'BAJA'
];

const InfoImpactoTab: React.FC<InfoImpactoTabProps> = ({ expediente, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    onChange(name as keyof Expediente, fieldValue);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Información de Impacto
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
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
              size="small"
              variant="outlined"
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
              size="small"
              variant="outlined"
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
            size="small"
            variant="outlined"
          />
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              select
              label="Nivel de Incidencia en la Zona"
              name="nivelIncidenciaZona"
              value={expediente.nivelIncidenciaZona || 'S/D'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {nivelesIncidenciaZona.map((option) => (
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
              label="Institución Sensible Cercana"
              name="institucionSensibleCercana"
              value={expediente.institucionSensibleCercana || 'S/D'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {institucionesSensibles.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              select
              label="Recursos Limitados"
              name="recursosLimitados"
              value={expediente.recursosLimitados || 'S/D'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {recursosLimitados.map((option) => (
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
              label="Área Fronteriza"
              name="areaFronteriza"
              value={expediente.areaFronteriza || 'S/D'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {areasFronterizas.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
          <TextField
            fullWidth
            select
            label="Impacto en la Percepción de Seguridad"
            name="impactoPercepcion"
            value={expediente.impactoPercepcion || 'S/D'}
            onChange={handleChange}
            margin="normal"
            size="small"
            variant="outlined"
          >
            {nivelesPercepcion.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Box>
    </Box>
  );
};

export default InfoImpactoTab; 