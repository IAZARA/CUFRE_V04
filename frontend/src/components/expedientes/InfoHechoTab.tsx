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

interface InfoHechoTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const tiposDano = [
  'S/D',
  'FISICO',
  'PSICOLOGICO',
  'MATERIAL'
];

const tiposVictima = [
  'S/D',
  'MENOR',
  'MUJER',
  'ANCIANO_JUBILADO',
  'POLITICO',
  'JUEZ',
  'FISCAL',
  'OTROS'
];

const InfoHechoTab: React.FC<InfoHechoTabProps> = ({ expediente, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    onChange(name as keyof Expediente, fieldValue);
  };

  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = value === '' ? 0 : Number(value);
    onChange(name as keyof Expediente, numericValue);
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Información del Hecho
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="Fecha del Hecho"
              name="fechaHecho"
              type="date"
              value={expediente.fechaHecho || ''}
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
              label="Lugar del Hecho"
              name="lugarHecho"
              value={expediente.lugarHecho || ''}
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
            multiline
            rows={3}
            label="Descripción del Hecho"
            name="descripcionHecho"
            value={expediente.descripcionHecho || ''}
            onChange={handleChange}
            margin="normal"
            size="small"
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.mediaticoFlag || false}
                  onChange={handleChange}
                  name="mediaticoFlag"
                />
              }
              label="Caso Mediático"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.usoArmasFuegoFlag || false}
                  onChange={handleChange}
                  name="usoArmasFuegoFlag"
                />
              }
              label="Uso de Armas de Fuego"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.usoArmasBlancasFlag || false}
                  onChange={handleChange}
                  name="usoArmasBlancasFlag"
                />
              }
              label="Uso de Armas Blancas"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.peligrosidadFlag || false}
                  onChange={handleChange}
                  name="peligrosidadFlag"
                />
              }
              label="Alta Peligrosidad"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="Número de Cómplices"
              name="numeroComplices"
              type="number"
              inputProps={{ min: 0 }}
              value={expediente.numeroComplices || 0}
              onChange={handleNumericChange}
              margin="normal"
              size="small"
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              select
              label="Tipo de Daño"
              name="tipoDano"
              value={expediente.tipoDano || 'S/D'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {tiposDano.map((option) => (
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
              label="Tipo de Víctima"
              name="tipoVictima"
              value={expediente.tipoVictima || 'S/D'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {tiposVictima.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.antecedentesFlag || false}
                  onChange={handleChange}
                  name="antecedentesFlag"
                />
              }
              label="Tiene Antecedentes"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.reincicenteFlag || false}
                  onChange={handleChange}
                  name="reincicenteFlag"
                />
              }
              label="Reincidente"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={expediente.reiteranteFlag || false}
                  onChange={handleChange}
                  name="reiteranteFlag"
                />
              }
              label="Reiterante"
            />
          </Box>
        </Box>
        
        <Box sx={{ display: expediente.antecedentesFlag ? 'block' : 'none' }}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Detalle de Antecedentes"
            name="detalleAntecedentes"
            value={expediente.detalleAntecedentes || ''}
            onChange={handleChange}
            margin="normal"
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InfoHechoTab; 