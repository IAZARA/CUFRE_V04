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

interface InfoProfugoTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const tiposTez = [
  'Blanca',
  'Trigueña',
  'Morena',
  'Negra',
  'Otra'
];

const tiposContextura = [
  'Delgada',
  'Media',
  'Robusta',
  'Atlética',
  'Obesa'
];

const coloresCabello = [
  'Negro',
  'Castaño',
  'Rubio',
  'Pelirrojo',
  'Canoso',
  'Teñido',
  'Otro'
];

const coloresOjos = [
  'Negros',
  'Marrones',
  'Verdes',
  'Azules',
  'Grises',
  'Otro'
];

const nivelesEstudio = [
  'S/D',
  'SIN_ESTUDIO',
  'PRIMARIO_INCOMPLETO',
  'PRIMARIO_COMPLETO',
  'SECUNDARIO_INCOMPLETO',
  'SECUNDARIO_COMPLETO',
  'TERCIARIO_INCOMPLETO',
  'TERCIARIO_COMPLETO',
  'UNIVERSITARIO_INCOMPLETO',
  'UNIVERSITARIO_COMPLETO'
];

const gruposSanguineos = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'Desconocido'
];

const ocupaciones = [
  'S/D',
  'OTRO',
  'OFICIO',
  'EMPLEADO',
  'PROFESIONAL',
  'FUERZA_SEGURIDAD',
  'FUERZA_ARMADA',
  'SERVICIO_INTELIGENCIA',
  'DESOCUPADO',
  'COMERCIANTE'
];

const InfoProfugoTab: React.FC<InfoProfugoTabProps> = ({ expediente, onChange }) => {
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
        Información del Prófugo
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              select
              label="Tez"
              name="profugoTez"
              value={expediente.profugoTez || ''}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {tiposTez.map((option) => (
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
              label="Contextura Física"
              name="profugoContexturaFisica"
              value={expediente.profugoContexturaFisica || ''}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {tiposContextura.map((option) => (
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
              label="Cabello"
              name="profugoCabello"
              value={expediente.profugoCabello || ''}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {coloresCabello.map((option) => (
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
              label="Ojos"
              name="profugoOjos"
              value={expediente.profugoOjos || ''}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {coloresOjos.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              label="Estatura (m)"
              name="profugoEstatura"
              type="number"
              inputProps={{ step: 0.01, min: 0 }}
              value={expediente.profugoEstatura || ''}
              onChange={handleNumericChange}
              margin="normal"
              size="small"
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(33.33% - 2rem)' } }}>
            <TextField
              fullWidth
              label="Peso (kg)"
              name="profugoPeso"
              type="number"
              inputProps={{ step: 0.1, min: 0 }}
              value={expediente.profugoPeso || ''}
              onChange={handleNumericChange}
              margin="normal"
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box>
          <TextField
            fullWidth
            label="Marcas Visibles"
            name="profugoMarcasVisibles"
            value={expediente.profugoMarcasVisibles || ''}
            onChange={handleChange}
            margin="normal"
            size="small"
            variant="outlined"
            helperText="Cicatrices, tatuajes, lunares, etc."
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              select
              label="Nivel de Estudios"
              name="profugoNivelEstudios"
              value={expediente.profugoNivelEstudios || 'S/D'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {nivelesEstudio.map((option) => (
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
              label="Ocupación"
              name="profugoProfesionOcupacion"
              value={expediente.profugoProfesionOcupacion || 'S/D'}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {ocupaciones.map((option) => (
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
              label="Grupo Sanguíneo"
              name="profugoGrupoSanguineo"
              value={expediente.profugoGrupoSanguineo || ''}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            >
              {gruposSanguineos.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="Teléfono"
              name="profugoTelefono"
              value={expediente.profugoTelefono || ''}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            />
          </Box>
        </Box>
        
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={expediente.profugoAntecedentesPenales || false}
                onChange={handleChange}
                name="profugoAntecedentesPenales"
              />
            }
            label="Tiene Antecedentes Penales"
          />
        </Box>
        
        <Box sx={{ display: expediente.profugoAntecedentesPenales ? 'block' : 'none' }}>
          <TextField
            fullWidth
            label="Detalle de Antecedentes"
            name="profugoDetalleAntecedentes"
            value={expediente.profugoDetalleAntecedentes || ''}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={2}
            size="small"
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="Situación Procesal"
              name="profugoSituacionProcesal"
              value={expediente.profugoSituacionProcesal || ''}
              onChange={handleChange}
              margin="normal"
              size="small"
              variant="outlined"
            />
          </Box>
          
          <Box sx={{ width: { xs: '100%', md: 'calc(50% - 1.5rem)' } }}>
            <TextField
              fullWidth
              label="Número de Prontuario"
              name="profugoNumeroProntuario"
              value={expediente.profugoNumeroProntuario || ''}
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
            label="Última Vez Visto"
            name="profugoUltimaVezVisto"
            value={expediente.profugoUltimaVezVisto || ''}
            onChange={handleChange}
            margin="normal"
            size="small"
            variant="outlined"
            helperText="Lugar y fecha donde fue visto por última vez"
          />
        </Box>
        
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={expediente.profugoEstabaDetenido || false}
                onChange={handleChange}
                name="profugoEstabaDetenido"
              />
            }
            label="Estaba Detenido"
          />
        </Box>
        
        <Box sx={{ width: { xs: '100%', md: '50%' }, display: expediente.profugoEstabaDetenido ? 'block' : 'none' }}>
          <TextField
            fullWidth
            label="Número de Detenciones Previas"
            name="profugoNumeroDetencionesPrevias"
            type="number"
            inputProps={{ min: 0 }}
            value={expediente.profugoNumeroDetencionesPrevias || 0}
            onChange={handleNumericChange}
            margin="normal"
            size="small"
            variant="outlined"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InfoProfugoTab; 