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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import Grid from '@mui/material/Grid';
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

const domicilioVacio: Partial<Domicilio> = {
  calle: '',
  numero: '',
  piso: '',
  departamento: '',
  codigoPostal: '',
  localidad: '',
  provincia: '',
  pais: '',
  observaciones: '',
  tipo: ''
};

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

  const [nuevoDomicilio, setNuevoDomicilio] = useState<Partial<Domicilio>>(domicilioVacio);
  const [editandoDomicilioIdx, setEditandoDomicilioIdx] = useState<number | null>(null);

  const [personaSeleccionada, setPersonaSeleccionada] = useState<PersonaExpediente | null>(null);
  const [domiciliosPersona, setDomiciliosPersona] = useState<Domicilio[]>([]);

  const [personaEnEdicion, setPersonaEnEdicion] = useState<PersonaExpediente | null>(null);
  const [mostrarFormularioDomicilio, setMostrarFormularioDomicilio] = useState<number | null>(null);
  const [domicilioEnEdicion, setDomicilioEnEdicion] = useState<Domicilio | null>(null);

  const [openDomicilioModal, setOpenDomicilioModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPersona(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDomicilioInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setNuevoDomicilio(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
      const personaExpedienteDTO = {
        persona: {
          numeroDocumento: newPersona.dni,
          tipoDocumento: 'DNI',
          nombre: newPersona.nombre,
          apellido: newPersona.apellido
        },
        tipoRelacion: newPersona.tipoRelacion,
        observaciones: newPersona.informacionAdicional || ''
      };
      if (personaEnEdicion && personaEnEdicion.persona?.id) {
        await expedienteService.updatePersona(personaEnEdicion.persona.id, personaExpedienteDTO.persona);
      } else {
        await expedienteService.addPersona(expediente.id, personaExpedienteDTO);
      }
      const personasActualizadas = await expedienteService.getPersonas(expediente.id);
      onChange('personas', personasActualizadas);
      setNewPersona({ dni: '', nombre: '', apellido: '', tipoRelacion: '', informacionAdicional: '', domicilios: [] });
      setEditing(false);
      setPersonaEnEdicion(null);
    } catch (err) {
      setError('Error al guardar persona. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditarPersona = (persona: PersonaExpediente) => {
    setPersonaEnEdicion(persona);
    setNewPersona({
      dni: persona.persona?.numeroDocumento || '',
      nombre: persona.persona?.nombre || '',
      apellido: persona.persona?.apellido || '',
      tipoRelacion: persona.tipoRelacion,
      informacionAdicional: persona.observaciones || '',
      domicilios: []
    });
    setEditing(true);
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

  const handleAgregarODomicilio = () => {
    if (!nuevoDomicilio.calle || !nuevoDomicilio.numero || !nuevoDomicilio.localidad) return;
    if (editandoDomicilioIdx !== null) {
      setNewPersona(prev => ({
        ...prev,
        domicilios: (prev.domicilios as Partial<Domicilio>[] || []).map((d, idx) =>
          idx === editandoDomicilioIdx ? { ...nuevoDomicilio } : d
        ) as any
      }));
      setEditandoDomicilioIdx(null);
    } else {
      setNewPersona(prev => ({
        ...prev,
        domicilios: [
          ...((prev.domicilios as Partial<Domicilio>[] || [])),
          { ...nuevoDomicilio }
        ] as any
      }));
    }
    setNuevoDomicilio(domicilioVacio);
  };

  const handleEditarDomicilio = (domicilio: Domicilio) => {
    setDomicilioEnEdicion(domicilio);
    setNuevoDomicilio(domicilio);
    setOpenDomicilioModal(true);
  };

  const handleEliminarDomicilio = async (personaId: number, domicilioId: number) => {
    if (typeof expediente.id !== 'number') return;
    setLoading(true);
    setError(null);
    try {
      await expedienteService.deleteDomicilio(domicilioId);
      const personasActualizadas = await expedienteService.getPersonas(expediente.id);
      onChange('personas', personasActualizadas);
    } catch (err) {
      setError('Error al eliminar domicilio. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleMostrarFormularioDomicilio = (personaId: number) => {
    setMostrarFormularioDomicilio(personaId);
    setNuevoDomicilio(domicilioVacio);
    setDomicilioEnEdicion(null);
  };

  const handleGuardarDomicilio = async () => {
    if (!mostrarFormularioDomicilio || !nuevoDomicilio.calle || !nuevoDomicilio.numero || !nuevoDomicilio.localidad) return;
    if (typeof expediente.id !== 'number') return;
    setLoading(true);
    setError(null);
    try {
      if (domicilioEnEdicion && typeof domicilioEnEdicion.id === 'number') {
        await expedienteService.updateDomicilio(domicilioEnEdicion.id, nuevoDomicilio);
      } else {
        await expedienteService.addDomicilio(mostrarFormularioDomicilio, nuevoDomicilio);
      }
      const personasActualizadas = await expedienteService.getPersonas(expediente.id);
      onChange('personas', personasActualizadas);
      setMostrarFormularioDomicilio(null);
      setNuevoDomicilio(domicilioVacio);
      setDomicilioEnEdicion(null);
    } catch (err) {
      setError('Error al guardar domicilio. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarPersona = async (persona: PersonaExpediente) => {
    setPersonaSeleccionada(persona);
    // Usar domicilios directamente del objeto personaSeleccionada
    if (Array.isArray(persona.domicilios)) {
      setDomiciliosPersona(persona.domicilios);
    } else {
      setDomiciliosPersona([]);
    }
  };

  const handleAgregarDomicilioPersona = () => {
    setDomicilioEnEdicion(null);
    setNuevoDomicilio({});
    setOpenDomicilioModal(true);
  };

  const handleCloseDomicilioModal = () => {
    setOpenDomicilioModal(false);
    setDomicilioEnEdicion(null);
    setNuevoDomicilio({});
  };

  const handleChangeDomicilio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNuevoDomicilio({ ...nuevoDomicilio, [e.target.name]: e.target.value });
  };

  const handleGuardarDomicilioModal = async () => {
    if (!personaSeleccionada || typeof personaSeleccionada.persona?.id !== 'number') return;
    try {
      if (domicilioEnEdicion && typeof domicilioEnEdicion.id === 'number') {
        await expedienteService.updateDomicilio(domicilioEnEdicion.id, nuevoDomicilio);
      } else {
        await expedienteService.addDomicilio(personaSeleccionada.persona.id, nuevoDomicilio);
      }
      // Refrescar domicilios
      const personasActualizadas = await expedienteService.getPersonas(expediente.id!);
      const personaActualizada = personasActualizadas.find(p => p.persona.id === personaSeleccionada.persona?.id);
      setPersonaSeleccionada(personaActualizada || null);
      setOpenDomicilioModal(false);
      setDomicilioEnEdicion(null);
      setNuevoDomicilio({});
    } catch (error) {
      // Manejo de error
    }
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
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell sx={{ color: '#1565c0', fontWeight: 'bold' }}>DNI/ID</TableCell>
                <TableCell sx={{ color: '#1565c0', fontWeight: 'bold' }}>Nombre Completo</TableCell>
                <TableCell sx={{ color: '#1565c0', fontWeight: 'bold' }}>Relación</TableCell>
                <TableCell sx={{ color: '#1565c0', fontWeight: 'bold' }}>Información</TableCell>
                <TableCell align="right" sx={{ color: '#1565c0', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expediente.personas.map((persona, personaIdx) => (
                <React.Fragment key={persona.id || personaIdx}>
                  <TableRow
                    hover
                    sx={{
                      backgroundColor: '#fff',
                      fontWeight: 'bold',
                      borderBottom: '2px solid #e3f2fd',
                      '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                  >
                    <TableCell sx={{ fontWeight: 'bold' }}>{persona.persona?.numeroDocumento || '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>{[persona.persona?.nombre, persona.persona?.apellido].filter(Boolean).join(' ') || '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
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
                    <TableCell sx={{ fontWeight: 'bold' }}>{persona.observaciones || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleEditarPersona(persona)}
                        aria-label="Seleccionar persona"
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
                  {/* Domicilios de la persona */}
                  {Array.isArray(persona.domicilios) && persona.domicilios.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={5} sx={{ p: 0, background: '#f5f5f5', borderLeft: '4px solid #1976d2' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pt: 1 }}>
                          <span style={{ color: '#1976d2', marginRight: 8 }}><span role="img" aria-label="casa">🏠</span></span>
                          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                            Domicilios
                          </Typography>
                        </Box>
                        <Table size="small" sx={{ ml: 4, width: '98%' }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Domicilio</TableCell>
                              <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {persona.domicilios.map((dom, idx) => (
                              <TableRow key={dom.id || idx}>
                                <TableCell>{[dom.calle, dom.numero].filter(Boolean).join(' ')}</TableCell>
                                <TableCell align="right">
                                  {typeof dom.id === 'number' && (
                                    <>
                                      <IconButton
                                        size="small"
                                        color="primary"
                                        onClick={() => handleEditarDomicilio(dom)}
                                        aria-label="Editar domicilio"
                                      >
                                        <EditIcon fontSize="small" />
                                      </IconButton>
                                      <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => handleEliminarDomicilio(persona.persona!.id as number, dom.id as number)}
                                        aria-label="Eliminar domicilio"
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </IconButton>
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                            {/* Botón para agregar domicilio al final de la lista */}
                            <TableRow>
                              <TableCell colSpan={2} align="right">
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  startIcon={<AddIcon />}
                                  onClick={() => {
                                    setPersonaSeleccionada(persona);
                                    handleAgregarDomicilioPersona();
                                  }}
                                >
                                  Agregar Domicilio
                                </Button>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                  {/* Si no hay domicilios, igual muestra el botón */}
                  {(!Array.isArray(persona.domicilios) || persona.domicilios.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} align="right" sx={{ background: '#f5f5f5', borderLeft: '4px solid #1976d2' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pt: 1, pb: 1 }}>
                          <span style={{ color: '#1976d2', marginRight: 8 }}><span role="img" aria-label="casa">🏠</span></span>
                          <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600, flexGrow: 1 }}>
                            Domicilios
                          </Typography>
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => {
                              setPersonaSeleccionada(persona);
                              handleAgregarDomicilioPersona();
                            }}
                          >
                            Agregar Domicilio
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {personaSeleccionada && (
        <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Domicilios de {personaSeleccionada.persona?.nombre} {personaSeleccionada.persona?.apellido}
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>DNI/ID</TableCell>
                  <TableCell>Domicilio</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {domiciliosPersona.map((dom, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{dom.id || '-'}</TableCell>
                    <TableCell>{[dom.calle, dom.numero].filter(Boolean).join(' ')}</TableCell>
                    <TableCell align="right">
                      {typeof personaSeleccionada?.persona?.id === 'number' && typeof dom.id === 'number' && (
                        <>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditarDomicilio(dom)}
                            aria-label="Editar domicilio"
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleEliminarDomicilio(personaSeleccionada.persona!.id as number, dom.id as number)}
                            aria-label="Eliminar domicilio"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => personaSeleccionada?.persona?.id !== undefined && handleMostrarFormularioDomicilio(personaSeleccionada.persona.id!)}
              disabled={loading || !nuevoDomicilio.calle || !nuevoDomicilio.numero || !nuevoDomicilio.localidad}
              startIcon={<AddIcon />}
            >
              {loading ? 'Guardando...' : 'Agregar Domicilio'}
            </Button>
          </Box>
        </Paper>
      )}

      <Dialog open={openDomicilioModal} onClose={handleCloseDomicilioModal} maxWidth="sm" fullWidth>
        <DialogTitle>{domicilioEnEdicion ? 'Editar domicilio' : 'Agregar domicilio'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
            <TextField label="Calle" name="calle" value={nuevoDomicilio.calle || ''} onChange={handleChangeDomicilio} fullWidth />
            <TextField label="Número" name="numero" value={nuevoDomicilio.numero || ''} onChange={handleChangeDomicilio} fullWidth />
            <TextField label="Piso" name="piso" value={nuevoDomicilio.piso || ''} onChange={handleChangeDomicilio} fullWidth />
            <TextField label="Departamento" name="departamento" value={nuevoDomicilio.departamento || ''} onChange={handleChangeDomicilio} fullWidth />
            <TextField label="Código Postal" name="codigoPostal" value={nuevoDomicilio.codigoPostal || ''} onChange={handleChangeDomicilio} fullWidth />
            <TextField label="Localidad" name="localidad" value={nuevoDomicilio.localidad || ''} onChange={handleChangeDomicilio} fullWidth />
            <TextField label="Provincia" name="provincia" value={nuevoDomicilio.provincia || ''} onChange={handleChangeDomicilio} fullWidth />
            <TextField label="País" name="pais" value={nuevoDomicilio.pais || ''} onChange={handleChangeDomicilio} fullWidth />
            <TextField select label="Tipo" name="tipo" value={nuevoDomicilio.tipo || ''} onChange={handleChangeDomicilio} fullWidth>
              <MenuItem value="">Seleccionar</MenuItem>
              <MenuItem value="Principal">Principal</MenuItem>
              <MenuItem value="Secundario">Secundario</MenuItem>
              <MenuItem value="Otro">Otro</MenuItem>
            </TextField>
            <TextField label="Observaciones" name="observaciones" value={nuevoDomicilio.observaciones || ''} onChange={handleChangeDomicilio} fullWidth multiline minRows={2} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDomicilioModal}>Cancelar</Button>
          <Button onClick={handleGuardarDomicilioModal} variant="contained" color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PersonasTab; 