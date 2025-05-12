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

interface InfoDetencionTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const fuerzasDetencion = [
  'S/D',
  'GNA',
  'PFA',
  'PSA',
  'PNA',
  'SPF',
  'POL LOCAL',
  'INTERPOL',
  'AMERIPOL',
  'EUROPOL',
  'BLOQUE DE BÚSQUEDA CUFRE'
];

const InfoDetencionTab: React.FC<InfoDetencionTabProps> = ({ expediente, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    onChange(name as keyof Expediente, fieldValue);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Información de la Detención
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="Fecha de Detención"
              name="fechaDetencion"
              type="date"
              value={expediente.fechaDetencion || ''}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="Lugar de Detención"
              name="lugarDetencion"
              value={expediente.lugarDetencion || ''}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box>
          <TextField
            fullWidth
            select
            label="Fuerza que realizó la Detención"
            name="fuerzaDetencion"
            value={expediente.fuerzaDetencion || 'S/D'}
            onChange={handleChange}
            margin="normal"
            size="small"
            variant="outlined"
          >
            {fuerzasDetencion.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        
        <Box>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Descripción del Procedimiento"
            name="descripcionProcedimiento"
            value={expediente.descripcionProcedimiento || ''}
            onChange={handleChange}
            margin="normal"
            helperText="Describa detalles relevantes del operativo y procedimiento de detención"
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InfoDetencionTab; 