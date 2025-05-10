import React from 'react';
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Box
} from '@mui/material';
import { Expediente } from '../../types/expediente.types';

interface InformacionBasicaTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const estados = [
  'SIN EFECTO',
  'Captura Vigente',
  'Detenido'
];

const jurisdicciones = [
  'Federal',
  'Provincial',
  'Municipal',
  'Otra'
];

const instancias = [
  'Primera Instancia',
  'Segunda Instancia',
  'Casación',
  'Corte Suprema',
  'Otra'
];

const fuerzasAsignadas = [
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

const InformacionBasicaTab: React.FC<InformacionBasicaTabProps> = ({ expediente, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    let fieldValue = type === 'checkbox' ? checked : value;
    // Si el campo es estadoSituacion, guardar en mayúsculas
    if (name === 'estadoSituacion') {
      fieldValue = (fieldValue as string).toUpperCase();
    }
    onChange(name as keyof Expediente, fieldValue);
  };

  // Asignar fecha actual para nuevos expedientes
  React.useEffect(() => {
    if (!expediente.fechaInicio) {
      const today = new Date().toISOString().split('T')[0];
      onChange('fechaInicio', today);
    }
  }, [expediente.fechaInicio, onChange]);

  return (
    <Box component="form" noValidate autoComplete="off">
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              required
              label="Número de Expediente"
              name="numero"
              value={expediente.numero}
              onChange={handleChange}
              margin="normal"
              helperText="Ingrese el número de identificación único del expediente"
            />
          </Box>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              required
              label="Fecha de Inicio"
              name="fechaInicio"
              type="date"
              value={expediente.fechaInicio}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </Box>
        <Box>
          <TextField
            fullWidth
            required
            label="Carátula"
            name="caratula"
            value={expediente.caratula}
            onChange={handleChange}
            margin="normal"
            helperText="Título o descripción breve del expediente"
          />
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              select
              label="Estado"
              name="estadoSituacion"
              value={expediente.estadoSituacion || 'SIN EFECTO'}
              onChange={handleChange}
              margin="normal"
            >
              {estados.map((option) => (
                <MenuItem key={option} value={option.toUpperCase()}>
                  {option.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              select
              label="Fuerza Asignada"
              name="fuerzaAsignada"
              value={expediente.fuerzaAsignada || 'S/D'}
              onChange={handleChange}
              margin="normal"
            >
              {fuerzasAsignadas.map((option) => (
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
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              select
              label="Instancia"
              name="instancia"
              value={expediente.instancia || ''}
              onChange={handleChange}
              margin="normal"
            >
              {instancias.map((option) => (
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
              label="Autorización de Tareas"
              name="autorizacionTareas"
              value={expediente.autorizacionTareas || ''}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="SI">SI</MenuItem>
              <MenuItem value="NO">NO</MenuItem>
            </TextField>
          </Box>
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              label="Fecha Autorización de Tareas"
              name="fechaAutorizacionTareas"
              type="date"
              value={expediente.fechaAutorizacionTareas || ''}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </Box>
        <Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descripción/Observaciones"
            name="descripcion"
            value={expediente.descripcion || ''}
            onChange={handleChange}
            margin="normal"
            helperText="Describa brevemente el contenido o propósito del expediente"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InformacionBasicaTab; 