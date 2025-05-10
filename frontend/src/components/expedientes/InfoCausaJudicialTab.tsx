import React from 'react';
import {
  TextField,
  MenuItem,
  Box,
  Typography
} from '@mui/material';
import { Expediente } from '../../types/expediente.types';

interface InfoCausaJudicialTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const jurisdicciones = [
  'Federal',
  'Provincial',
  'Municipal',
  'Otra'
];

const tiposCaptura = [
  'OTRO',
  'NACIONAL',
  'INTERNACIONAL'
];

const InfoCausaJudicialTab: React.FC<InfoCausaJudicialTabProps> = ({ expediente, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    onChange(name as keyof Expediente, fieldValue);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" gutterBottom>
        Información de la Causa Judicial
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="Fecha Oficio"
              name="fechaOficio"
              type="date"
              value={expediente.fechaOficio || ''}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="Número de Causa"
              name="numeroCausa"
              value={expediente.numeroCausa || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </Box>
        
        <Box>
          <TextField
            fullWidth
            required
            label="Carátula"
            name="caratula"
            value={expediente.caratula || ''}
            onChange={handleChange}
            margin="normal"
            helperText="Título o descripción breve del expediente"
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="Juzgado"
              name="juzgado"
              value={expediente.juzgado || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="Secretaría"
              name="secretaria"
              value={expediente.secretaria || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              label="Fiscalía"
              name="fiscalia"
              value={expediente.fiscalia || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              select
              label="Jurisdicción"
              name="jurisdiccion"
              value={expediente.jurisdiccion || ''}
              onChange={handleChange}
              margin="normal"
            >
              {jurisdicciones.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              label="Provincia"
              name="provincia"
              value={expediente.provincia || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              select
              label="Tipo de Captura"
              name="tipoCaptura"
              value={expediente.tipoCaptura || 'OTRO'}
              onChange={handleChange}
              margin="normal"
            >
              {tiposCaptura.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="País"
              name="pais"
              value={expediente.pais || ''}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </Box>
        
        <Box>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Motivo de Captura"
            name="motivoCaptura"
            value={expediente.motivoCaptura || ''}
            onChange={handleChange}
            margin="normal"
          />
        </Box>
        
        <Box>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Disposición del Juzgado"
            name="disposicionJuzgado"
            value={expediente.disposicionJuzgado || ''}
            onChange={handleChange}
            margin="normal"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InfoCausaJudicialTab; 