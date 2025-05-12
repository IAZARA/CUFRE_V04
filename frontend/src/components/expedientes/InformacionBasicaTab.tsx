import React from 'react';
import {
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Box,
  Typography,
  Divider,
  Tooltip
} from '@mui/material';
import { Expediente } from '../../types/expediente.types';

interface InformacionBasicaTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
  onCreateExpediente?: () => void;
  expedienteId?: number;
  loading?: boolean;
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

const InformacionBasicaTab: React.FC<InformacionBasicaTabProps> = ({ expediente, onChange, onCreateExpediente, expedienteId, loading }) => {
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
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Información Básica del Expediente
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 2rem)' } }}>
            <Tooltip title="Este número es único para cada expediente" arrow>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  fullWidth
                  required
                  label="Número de Expediente"
                  name="numero"
                  value={expediente.numero}
                  onChange={handleChange}
                  margin="normal"
                  helperText="Ingrese el número de identificación único del expediente"
                  size="small"
                  variant="outlined"
                />
                {!expedienteId && onCreateExpediente && (
                  <button
                    type="button"
                    style={{ height: 40 }}
                    onClick={onCreateExpediente}
                    disabled={loading || !expediente.numero}
                  >
                    Crear expediente
                  </button>
                )}
              </Box>
            </Tooltip>
          </Box>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 2rem)' } }}>
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
              size="small"
              variant="outlined"
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
            size="small"
            variant="outlined"
          />
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              select
              label="Estado"
              name="estadoSituacion"
              value={expediente.estadoSituacion || 'SIN EFECTO'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
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
              size="small"
              variant="outlined"
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
              size="small"
              variant="outlined"
            >
              {jurisdicciones.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              select
              label="Instancia"
              name="instancia"
              value={expediente.instancia || ''}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
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
              size="small"
              variant="outlined"
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
              size="small"
              variant="outlined"
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
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InformacionBasicaTab; 