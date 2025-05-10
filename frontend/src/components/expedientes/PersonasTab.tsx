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

interface PersonasTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const tiposRelacion = [
  'Imputado',
  'Víctima',
  'Testigo',
  'Informante',
  'Cómplice',
  'Familiar',
  'Asociado',
  'Responsable Civil',
  'Otro'
];

const PersonasTab: React.FC<PersonasTabProps> = ({ expediente, onChange }) => {
  const [newPersona, setNewPersona] = useState<Partial<PersonaExpediente>>({
    dni: '',
    nombre: '',
    apellido: '',
    tipoRelacion: '',
    informacionAdicional: ''
  });
  
  const [editing, setEditing] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(-1);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPersona(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPersona = () => {
    if (!newPersona.dni || !newPersona.nombre || !newPersona.apellido || !newPersona.tipoRelacion) {
      return;
    }
    
    if (editing && editIndex >= 0) {
      // Actualizar persona existente
      const updatedPersonas = [...expediente.personas];
      updatedPersonas[editIndex] = {
        ...updatedPersonas[editIndex],
        ...newPersona as PersonaExpediente
      };
      
      onChange('personas', updatedPersonas);
      setEditing(false);
      setEditIndex(-1);
    } else {
      // Agregar nueva persona
      const updatedPersonas = [
        ...expediente.personas,
        {
          id: Date.now(), // Temporal ID for UI
          dni: newPersona.dni,
          nombre: newPersona.nombre,
          apellido: newPersona.apellido,
          tipoRelacion: newPersona.tipoRelacion,
          informacionAdicional: newPersona.informacionAdicional || ''
        }
      ];
      
      onChange('personas', updatedPersonas);
    }
    
    // Reset form
    setNewPersona({
      dni: '',
      nombre: '',
      apellido: '',
      tipoRelacion: '',
      informacionAdicional: ''
    });
  };

  const handleEditPersona = (index: number) => {
    const persona = expediente.personas[index];
    
    setNewPersona({
      dni: persona.dni,
      nombre: persona.nombre,
      apellido: persona.apellido,
      tipoRelacion: persona.tipoRelacion,
      informacionAdicional: persona.informacionAdicional
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
        informacionAdicional: ''
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
      informacionAdicional: ''
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
                <MenuItem key={option} value={option}>
                  {option}
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
              disabled={!newPersona.dni || !newPersona.nombre || !newPersona.apellido || !newPersona.tipoRelacion}
              startIcon={editing ? <EditIcon /> : <AddIcon />}
            >
              {editing ? 'Actualizar' : 'Agregar'}
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
              {expediente.personas.map((persona, index) => (
                <TableRow key={persona.id} hover>
                  <TableCell>{persona.dni}</TableCell>
                  <TableCell>{`${persona.nombre} ${persona.apellido}`}</TableCell>
                  <TableCell>
                    <Chip 
                      label={persona.tipoRelacion} 
                      color={
                        persona.tipoRelacion === 'Imputado' ? 'error' :
                        persona.tipoRelacion === 'Víctima' ? 'warning' :
                        persona.tipoRelacion === 'Testigo' ? 'info' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{persona.informacionAdicional || '-'}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleEditPersona(index)}
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