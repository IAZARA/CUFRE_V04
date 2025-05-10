import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Stack,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import expedienteService from '../../api/expedienteService';
import personaService from '../../api/personaService';
import { Vinculo } from '../../types/expediente.types';
import { Persona, Domicilio, MedioComunicacion } from '../../types/persona.types';

interface VinculosTabProps {
  expedienteId: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vinculo-tabpanel-${index}`}
      aria-labelledby={`vinculo-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const tiposVinculo = [
  'Imputado',
  'Víctima',
  'Testigo',
  'Denunciante',
  'Representante Legal',
  'Otro'
];

const VinculosTab: React.FC<VinculosTabProps> = ({ expedienteId }) => {
  const [vinculos, setVinculos] = useState<Vinculo[]>([]);
  const [personaSeleccionada, setPersonaSeleccionada] = useState<Persona | null>(null);
  const [personasEncontradas, setPersonasEncontradas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estado para el diálogo
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTab, setDialogTab] = useState(0);
  const [busqueda, setBusqueda] = useState('');
  const [tipoVinculo, setTipoVinculo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  
  // Estado para la nueva persona
  const [nuevaPersona, setNuevaPersona] = useState<Persona>({
    nombre: '',
    apellido: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    sexo: '',
    estadoCivil: ''
  });

  // Estado para mostrar detalles de persona seleccionada
  const [mostrarDetallesPersona, setMostrarDetallesPersona] = useState(false);
  const [personaDetalles, setPersonaDetalles] = useState<Persona | null>(null);
  const [domicilios, setDomicilios] = useState<Domicilio[]>([]);
  const [mediosComunicacion, setMediosComunicacion] = useState<MedioComunicacion[]>([]);

  useEffect(() => {
    fetchVinculos();
  }, [expedienteId]);

  const fetchVinculos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expedienteService.getVinculos(expedienteId);
      setVinculos(data);
    } catch (err: any) {
      console.error('Error al cargar vínculos:', err);
      setError(err.response?.data?.message || 'Error al cargar los vínculos');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
    setDialogTab(0);
    setBusqueda('');
    setTipoVinculo('');
    setObservaciones('');
    setPersonaSeleccionada(null);
    setPersonasEncontradas([]);
    setNuevaPersona({
      nombre: '',
      apellido: '',
      tipoDocumento: 'DNI',
      numeroDocumento: '',
      sexo: '',
      estadoCivil: ''
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDialogTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setDialogTab(newValue);
  };

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const handleBuscarPersona = async () => {
    if (!busqueda.trim()) {
      setError('Ingrese un término de búsqueda');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await personaService.searchPersonas(busqueda);
      setPersonasEncontradas(data);
      
      if (data.length === 0) {
        setError('No se encontraron personas con ese criterio de búsqueda');
      }
    } catch (err: any) {
      console.error('Error al buscar personas:', err);
      setError(err.response?.data?.message || 'Error al buscar personas');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonaChange = (field: keyof Persona, value: any) => {
    setNuevaPersona({ ...nuevaPersona, [field]: value });
  };

  const handleSeleccionarPersona = (persona: Persona) => {
    setPersonaSeleccionada(persona);
  };

  const handleVerDetalles = async (personaId: number) => {
    try {
      setLoading(true);
      
      // Cargar detalles completos de la persona
      const persona = await personaService.getById(personaId);
      setPersonaDetalles(persona);
      
      // Cargar domicilios
      const domiciliosData = await personaService.getDomicilios(personaId);
      setDomicilios(domiciliosData);
      
      // Cargar medios de comunicación
      const mediosData = await personaService.getMediosComunicacion(personaId);
      setMediosComunicacion(mediosData);
      
      setMostrarDetallesPersona(true);
    } catch (err: any) {
      console.error('Error al cargar detalles de persona:', err);
      setError(err.response?.data?.message || 'Error al cargar detalles de persona');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearPersona = async () => {
    if (!nuevaPersona.nombre || !nuevaPersona.apellido) {
      setError('Por favor complete al menos el nombre y apellido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const personaCreada = await personaService.create(nuevaPersona);
      setPersonaSeleccionada(personaCreada);
      setSuccess('Persona creada correctamente');
      
      // Cambiar a la pestaña de Vincular Persona
      setDialogTab(0);
    } catch (err: any) {
      console.error('Error al crear persona:', err);
      setError(err.response?.data?.message || 'Error al crear persona');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearVinculo = async () => {
    if (!personaSeleccionada || !tipoVinculo) {
      setError('Seleccione una persona y un tipo de vínculo');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const vinculo: Vinculo = {
        expedienteId: expedienteId,
        personaId: personaSeleccionada.id!,
        tipo: tipoVinculo,
        observaciones: observaciones
      };
      
      await expedienteService.createVinculo(vinculo);
      setSuccess('Vínculo creado correctamente');
      setOpenDialog(false);
      fetchVinculos(); // Actualizar la lista
    } catch (err: any) {
      console.error('Error al crear vínculo:', err);
      setError(err.response?.data?.message || 'Error al crear vínculo');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarVinculo = async (id: number) => {
    if (window.confirm('¿Está seguro que desea eliminar este vínculo?')) {
      try {
        setLoading(true);
        await expedienteService.deleteVinculo(id);
        setSuccess('Vínculo eliminado correctamente');
        fetchVinculos(); // Actualizar la lista
      } catch (err: any) {
        console.error('Error al eliminar vínculo:', err);
        setError(err.response?.data?.message || 'Error al eliminar vínculo');
      } finally {
        setLoading(false);
      }
    }
  };

  const cerrarDetallesPersona = () => {
    setMostrarDetallesPersona(false);
  };

  if (loading && vinculos.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Personas Vinculadas</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Agregar Vínculo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {vinculos.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            No hay personas vinculadas
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Agregue vínculos con personas usando el botón "Agregar Vínculo"
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Persona</TableCell>
                <TableCell>Documento</TableCell>
                <TableCell>Tipo de Vínculo</TableCell>
                <TableCell>Observaciones</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vinculos.map((vinculo) => (
                <TableRow key={vinculo.id} hover>
                  <TableCell>{`${vinculo.personaNombre} ${vinculo.personaApellido}`}</TableCell>
                  <TableCell>{vinculo.personaDocumento}</TableCell>
                  <TableCell>
                    <Chip 
                      label={vinculo.tipo} 
                      color={
                        vinculo.tipo === 'Imputado' ? 'error' : 
                        vinculo.tipo === 'Víctima' ? 'warning' :
                        vinculo.tipo === 'Testigo' ? 'info' : 
                        'default'
                      } 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>{vinculo.observaciones}</TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      onClick={() => handleVerDetalles(vinculo.personaId)}
                    >
                      <PersonIcon />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleEliminarVinculo(vinculo.id!)}
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

      {/* Diálogo para agregar vínculo */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Agregar Vínculo de Persona</DialogTitle>
        <DialogContent>
          <Tabs value={dialogTab} onChange={handleDialogTabChange} sx={{ mb: 2 }}>
            <Tab label="Buscar Persona" />
            <Tab label="Crear Nueva Persona" />
          </Tabs>

          <TabPanel value={dialogTab} index={0}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  label="Buscar por nombre, apellido o documento"
                  value={busqueda}
                  onChange={handleBusquedaChange}
                />
                <Button 
                  variant="contained" 
                  startIcon={<SearchIcon />}
                  onClick={handleBuscarPersona}
                  disabled={loading}
                >
                  Buscar
                </Button>
              </Stack>

              {personasEncontradas.length > 0 && (
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Apellido</TableCell>
                        <TableCell>Documento</TableCell>
                        <TableCell>Acción</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {personasEncontradas.map((persona) => (
                        <TableRow 
                          key={persona.id} 
                          hover
                          selected={personaSeleccionada?.id === persona.id}
                        >
                          <TableCell>{persona.nombre}</TableCell>
                          <TableCell>{persona.apellido}</TableCell>
                          <TableCell>{`${persona.tipoDocumento || ''} ${persona.numeroDocumento || ''}`}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleSeleccionarPersona(persona)}
                            >
                              Seleccionar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {personaSeleccionada && (
                <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Persona seleccionada: {personaSeleccionada.nombre} {personaSeleccionada.apellido}
                  </Typography>
                  
                  <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="tipo-vinculo-label">Tipo de Vínculo</InputLabel>
                    <Select
                      labelId="tipo-vinculo-label"
                      value={tipoVinculo}
                      label="Tipo de Vínculo"
                      onChange={(e) => setTipoVinculo(e.target.value)}
                      required
                    >
                      {tiposVinculo.map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>
                          {tipo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <TextField
                    fullWidth
                    label="Observaciones"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    multiline
                    rows={3}
                    sx={{ mt: 2 }}
                  />
                </Box>
              )}
            </Stack>
          </TabPanel>

          <TabPanel value={dialogTab} index={1}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  value={nuevaPersona.nombre}
                  onChange={(e) => handlePersonaChange('nombre', e.target.value)}
                />
                <TextField
                  fullWidth
                  required
                  label="Apellido"
                  value={nuevaPersona.apellido}
                  onChange={(e) => handlePersonaChange('apellido', e.target.value)}
                />
              </Stack>
              
              <Stack direction="row" spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="tipo-documento-label">Tipo de Documento</InputLabel>
                  <Select
                    labelId="tipo-documento-label"
                    value={nuevaPersona.tipoDocumento || 'DNI'}
                    label="Tipo de Documento"
                    onChange={(e) => handlePersonaChange('tipoDocumento', e.target.value)}
                  >
                    <MenuItem value="DNI">DNI</MenuItem>
                    <MenuItem value="Pasaporte">Pasaporte</MenuItem>
                    <MenuItem value="Cédula">Cédula</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Número de Documento"
                  value={nuevaPersona.numeroDocumento || ''}
                  onChange={(e) => handlePersonaChange('numeroDocumento', e.target.value)}
                />
              </Stack>
              
              <Stack direction="row" spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="sexo-label">Sexo</InputLabel>
                  <Select
                    labelId="sexo-label"
                    value={nuevaPersona.sexo || ''}
                    label="Sexo"
                    onChange={(e) => handlePersonaChange('sexo', e.target.value)}
                  >
                    <MenuItem value="Masculino">Masculino</MenuItem>
                    <MenuItem value="Femenino">Femenino</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth>
                  <InputLabel id="estado-civil-label">Estado Civil</InputLabel>
                  <Select
                    labelId="estado-civil-label"
                    value={nuevaPersona.estadoCivil || ''}
                    label="Estado Civil"
                    onChange={(e) => handlePersonaChange('estadoCivil', e.target.value)}
                  >
                    <MenuItem value="Soltero/a">Soltero/a</MenuItem>
                    <MenuItem value="Casado/a">Casado/a</MenuItem>
                    <MenuItem value="Divorciado/a">Divorciado/a</MenuItem>
                    <MenuItem value="Viudo/a">Viudo/a</MenuItem>
                    <MenuItem value="Otro">Otro</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
              
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleCrearPersona}
                disabled={loading || !nuevaPersona.nombre || !nuevaPersona.apellido}
              >
                {loading ? <CircularProgress size={24} /> : 'Crear Persona'}
              </Button>
            </Stack>
          </TabPanel>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button 
            onClick={handleCrearVinculo} 
            variant="contained" 
            color="primary"
            disabled={loading || !personaSeleccionada || !tipoVinculo}
          >
            Vincular Persona
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo para mostrar detalles de persona */}
      <Dialog open={mostrarDetallesPersona} onClose={cerrarDetallesPersona} maxWidth="md" fullWidth>
        <DialogTitle>
          Detalles de Persona
        </DialogTitle>
        <DialogContent>
          {personaDetalles && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {personaDetalles.nombre} {personaDetalles.apellido}
              </Typography>
              
              <Stack spacing={3}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Información Personal
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                      <strong>Documento:</strong> {personaDetalles.tipoDocumento} {personaDetalles.numeroDocumento}
                    </Typography>
                    {personaDetalles.fechaNacimiento && (
                      <Typography variant="body2">
                        <strong>Fecha de Nacimiento:</strong> {personaDetalles.fechaNacimiento}
                      </Typography>
                    )}
                    {personaDetalles.sexo && (
                      <Typography variant="body2">
                        <strong>Sexo:</strong> {personaDetalles.sexo}
                      </Typography>
                    )}
                    {personaDetalles.estadoCivil && (
                      <Typography variant="body2">
                        <strong>Estado Civil:</strong> {personaDetalles.estadoCivil}
                      </Typography>
                    )}
                  </Stack>
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Domicilios
                  </Typography>
                  
                  {domicilios.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                      No hay domicilios registrados
                    </Typography>
                  ) : (
                    <Stack spacing={2}>
                      {domicilios.map((dom, index) => (
                        <Box key={dom.id || index} sx={{ p: 1, borderLeft: '3px solid #1976d2' }}>
                          <Typography variant="body2">
                            <strong>Dirección:</strong> {dom.calle} {dom.numero}
                            {dom.piso && `, Piso ${dom.piso}`}
                            {dom.departamento && `, Depto ${dom.departamento}`}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Localidad:</strong> {dom.localidad || '-'}, {dom.provincia || '-'}
                          </Typography>
                          {dom.tipo && (
                            <Typography variant="body2">
                              <strong>Tipo:</strong> {dom.tipo}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Paper>
                
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Medios de Comunicación
                  </Typography>
                  
                  {mediosComunicacion.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                      No hay medios de comunicación registrados
                    </Typography>
                  ) : (
                    <Stack spacing={1}>
                      {mediosComunicacion.map((medio, index) => (
                        <Box key={medio.id || index} sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip 
                            label={medio.tipo} 
                            size="small" 
                            color="primary" 
                            sx={{ mr: 2 }}
                          />
                          <Typography variant="body2">
                            {medio.valor}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  )}
                </Paper>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarDetallesPersona}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default VinculosTab; 