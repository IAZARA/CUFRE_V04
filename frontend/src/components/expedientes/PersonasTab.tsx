import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { Expediente, PersonaExpediente } from '../../types/expediente.types';
import expedienteService from '../../api/expedienteService';
import { Domicilio } from '../../types/persona.types';

interface PersonasTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const tiposRelacion = [
  { value: 'Imputado', label: 'Prófugo' },
  { value: 'Víctima', label: 'Víctima' },
  { value: 'Testigo', label: 'Testigo' },
  { value: 'Informante', label: 'Informante' },
  { value: 'Cómplice', label: 'Cómplice' },
  { value: 'Familiar', label: 'Familiar' },
  { value: 'Asociado', label: 'Asociado' },
  { value: 'Responsable Civil', label: 'Responsable Civil' },
  { value: 'Otro', label: 'Otro' }
];

const PersonasTab: React.FC<PersonasTabProps> = ({ expediente, onChange }) => {
  const [newPersona, setNewPersona] = useState<Partial<PersonaExpediente>>({
    dni: '',
    nombre: '',
    apellido: '',
    tipoRelacion: '',
    informacionAdicional: '',
    domicilios: []
  });
  
  const [editing, setEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPersona(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPersona = async () => {
    if (!newPersona.dni || !newPersona.nombre || !newPersona.apellido || !newPersona.tipoRelacion) {
      return;
    }
    if (typeof expediente.id !== 'number') {
      setError('No se puede agregar persona: expediente sin ID.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Construir el DTO para el backend con los campos correctos, incluyendo domicilios
      const personaExpedienteDTO = {
        persona: {
          numeroDocumento: newPersona.dni,
          tipoDocumento: 'DNI',
          nombre: newPersona.nombre,
          apellido: newPersona.apellido,
          domicilios: newPersona.domicilios || []
        },
        tipoRelacion: newPersona.tipoRelacion,
        observaciones: newPersona.informacionAdicional || ''
      };
      const response = await expedienteService.addPersona(expediente.id, personaExpedienteDTO);
      // Recargar la lista de personas desde el backend
      const personasActualizadas = await expedienteService.getPersonas(expediente.id);
      onChange('personas', personasActualizadas);
      setNewPersona({
        dni: '',
        nombre: '',
        apellido: '',
        tipoRelacion: '',
        informacionAdicional: '',
        domicilios: []
      });
      setEditing(false);
      setEditIndex(-1);
    } catch (err) {
      setError('Error al agregar persona. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPersona = (index: number) => {
    const persona = expediente.personas[index];
    
    setNewPersona({
      dni: persona.persona?.numeroDocumento || '',
      nombre: persona.persona?.nombre || '',
      apellido: persona.persona?.apellido || '',
      tipoRelacion: persona.tipoRelacion,
      informacionAdicional: persona.observaciones || '',
      domicilios: persona.domicilios || []
    });
    
    setEditing(true);
    setEditIndex(index);
  };

  const handleDeletePersona = (id: number | undefined) => {
    if (!id) return;
    
    const updatedPersonas = expediente.personas.filter(p => p.id !== id);
    onChange('personas', updatedPersonas);
    
    // Si estamos editando esta persona, resetear el formulario
    if (editing && editIndex >= 0 && expediente.personas[editIndex].id === id) {
      setNewPersona({
        dni: '',
        nombre: '',
        apellido: '',
        tipoRelacion: '',
        informacionAdicional: '',
        domicilios: []
      });
      setEditing(false);
      setEditIndex(-1);
    }
  };

  const handleCancelEdit = () => {
    setNewPersona({
      dni: '',
      nombre: '',
      apellido: '',
      tipoRelacion: '',
      informacionAdicional: '',
      domicilios: []
    });
    setEditing(false);
    setEditIndex(-1);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Personas Vinculadas
      </Typography>
      
      <Paper variant="outlined" sx={{ p: 2, mb: 4 }}>
        <Typography variant="subtitle1" gutterBottom>
          {editing ? 'Editar Persona' : 'Agregar Nueva Persona'}
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>
        )}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <TextField
              label="DNI/Identificación"
              name="dni"
              value={newPersona.dni || ''}
              onChange={handleInputChange}
              sx={{ flex: '1 1 200px' }}
            />
            
            <TextField
              label="Nombre"
              name="nombre"
              value={newPersona.nombre || ''}
              onChange={handleInputChange}
              sx={{ flex: '1 1 200px' }}
            />
            
            <TextField
              label="Apellido"
              name="apellido"
              value={newPersona.apellido || ''}
              onChange={handleInputChange}
              sx={{ flex: '1 1 200px' }}
            />
            
            <TextField
              select
              label="Tipo de Relación"
              name="tipoRelacion"
              value={newPersona.tipoRelacion || ''}
              onChange={handleInputChange}
              sx={{ flex: '1 1 200px' }}
            >
              {tiposRelacion.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          
          <TextField
            label="Información Adicional"
            name="informacionAdicional"
            value={newPersona.informacionAdicional || ''}
            onChange={handleInputChange}
            multiline
            rows={2}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {editing && (
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={handleCancelEdit}
              >
                Cancelar
              </Button>
            )}
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddPersona}
              disabled={loading || !newPersona.dni || !newPersona.nombre || !newPersona.apellido || !newPersona.tipoRelacion}
              startIcon={editing ? <EditIcon /> : <AddIcon />}
            >
              {loading ? 'Guardando...' : (editing ? 'Actualizar' : 'Agregar')}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Typography variant="subtitle1" gutterBottom>
        Personas Registradas ({expediente.personas.length})
      </Typography>
      
      {expediente.personas.length === 0 ? (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
          No hay personas vinculadas a este expediente.
        </Typography>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>DNI/ID</TableCell>
                <TableCell>Nombre Completo</TableCell>
                <TableCell>Relación</TableCell>
                <TableCell>Información</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expediente.personas.map((persona, personaIdx) => (
                <TableRow key={persona.id || personaIdx} hover>
                  <TableCell>{persona.persona?.numeroDocumento || '-'}</TableCell>
                  <TableCell>{[persona.persona?.nombre, persona.persona?.apellido].filter(Boolean).join(' ') || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={
                        persona.tipoRelacion && persona.tipoRelacion.trim().toLowerCase().includes('imputado')
                          ? 'Prófugo'
                          : persona.tipoRelacion || '-'
                      }
                      color={
                        persona.tipoRelacion && persona.tipoRelacion.trim().toLowerCase().includes('imputado') ? 'error' :
                        persona.tipoRelacion === 'Víctima' ? 'warning' :
                        persona.tipoRelacion === 'Testigo' ? 'info' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{persona.observaciones || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleEditPersona(personaIdx)}
                      aria-label="Editar persona"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeletePersona(persona.id)}
                      aria-label="Eliminar persona"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default PersonasTab; 