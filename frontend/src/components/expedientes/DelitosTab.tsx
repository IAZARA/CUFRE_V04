import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Expediente, ExpedienteDelito, Delito } from '../../types/expediente.types';
import delitoService from '../../api/delitoService';

interface DelitosTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const DelitosTab: React.FC<DelitosTabProps> = ({ expediente, onChange }) => {
  const [delitosAsociados, setDelitosAsociados] = useState<ExpedienteDelito[]>([]);
  const [delitosDisponibles, setDelitosDisponibles] = useState<Delito[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [filteredDelitos, setFilteredDelitos] = useState<Delito[]>([]);

  // Cargar delitos disponibles
  useEffect(() => {
    const fetchDelitos = async () => {
      setLoading(true);
      try {
        const delitos = await delitoService.getAll();
        setDelitosDisponibles(delitos);
        setFilteredDelitos(delitos);
        
        // Si ya tenemos un ID de expediente, cargar sus delitos asociados
        if (expediente.id) {
          const asociados = await delitoService.getDelitosPorExpediente(expediente.id);
          setDelitosAsociados(asociados);
        }
      } catch (err) {
        console.error('Error al obtener delitos:', err);
        setError('Error al cargar los delitos. Por favor intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchDelitos();
  }, [expediente.id]);

  // Filtrar delitos por búsqueda
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredDelitos(delitosDisponibles);
      return;
    }
    
    const filtered = delitosDisponibles.filter(delito => 
      delito.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (delito.descripcion && delito.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (delito.ley && delito.ley.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (delito.articulo && delito.articulo.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredDelitos(filtered);
  };

  // Abrir diálogo para seleccionar delitos
  const handleOpenDialog = () => {
    setSearchTerm('');
    setFilteredDelitos(delitosDisponibles);
    setOpenDialog(true);
  };

  // Cerrar diálogo
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Asociar un delito al expediente
  const handleAsociarDelito = (delito: Delito) => {
    // Si el expediente no tiene ID, agregar a la lista local
    if (!expediente.id) {
      const nuevoDelitoAsociado: ExpedienteDelito = {
        expedienteId: -1, // Temporal
        delitoId: delito.id || 0,
        delitoNombre: delito.nombre,
        delitoEsGrave: delito.esGrave,
        delitoArticulo: delito.articulo,
        delitoLey: delito.ley,
        fechaRegistro: new Date().toISOString().split('T')[0],
        observaciones: ''
      };
      
      const updatedDelitos = [...delitosAsociados, nuevoDelitoAsociado];
      setDelitosAsociados(updatedDelitos);
      
      // Actualizar el campo delitos en el expediente
      const delitosIds = updatedDelitos.map(d => d.delitoId.toString());
      onChange('delitos', delitosIds);
      
      handleCloseDialog();
      return;
    }
    
    // Si el expediente tiene ID, llamar al API para asociar
    const nuevoDelitoAsociado: ExpedienteDelito = {
      expedienteId: expediente.id || 0,
      delitoId: delito.id || 0
    };
    
    setLoading(true);
    delitoService.asociarDelitoExpediente(nuevoDelitoAsociado)
      .then(response => {
        // Agregar a la lista local
        const delitoCompleto: ExpedienteDelito = {
          ...response,
          delitoNombre: delito.nombre,
          delitoEsGrave: delito.esGrave,
          delitoArticulo: delito.articulo,
          delitoLey: delito.ley
        };
        
        const updatedDelitos = [...delitosAsociados, delitoCompleto];
        setDelitosAsociados(updatedDelitos);
        
        // Actualizar el campo delitos en el expediente
        const delitosIds = updatedDelitos.map(d => d.delitoId.toString());
        onChange('delitos', delitosIds);
        
        handleCloseDialog();
      })
      .catch(err => {
        console.error('Error al asociar delito:', err);
        setError('Error al asociar el delito. Por favor intente nuevamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Desasociar un delito del expediente
  const handleDesasociarDelito = (expedienteDelito: ExpedienteDelito) => {
    // Si el expediente no tiene ID, simplemente quitar de la lista local
    if (!expediente.id || !expedienteDelito.id) {
      const updatedDelitos = delitosAsociados.filter(d => 
        d.delitoId !== expedienteDelito.delitoId
      );
      setDelitosAsociados(updatedDelitos);
      
      // Actualizar el campo delitos en el expediente
      const delitosIds = updatedDelitos.map(d => d.delitoId.toString());
      onChange('delitos', delitosIds);
      
      return;
    }
    
    // Si el expediente tiene ID, llamar al API para desasociar
    setLoading(true);
    delitoService.desasociarDelitoExpediente(expedienteDelito.id || 0)
      .then(() => {
        const updatedDelitos = delitosAsociados.filter(d => d.id !== expedienteDelito.id);
        setDelitosAsociados(updatedDelitos);
        
        // Actualizar el campo delitos en el expediente
        const delitosIds = updatedDelitos.map(d => d.delitoId.toString());
        onChange('delitos', delitosIds);
      })
      .catch(err => {
        console.error('Error al desasociar delito:', err);
        setError('Error al desasociar el delito. Por favor intente nuevamente.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Delitos Asociados
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          disabled={loading}
        >
          Vincular Delito
        </Button>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : delitosAsociados.length === 0 ? (
        <Typography color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
          No hay delitos asociados a este expediente.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Delito</TableCell>
                <TableCell>Artículo</TableCell>
                <TableCell>Ley</TableCell>
                <TableCell>Gravedad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {delitosAsociados.map((expedienteDelito) => (
                <TableRow key={expedienteDelito.id || `temp-${expedienteDelito.delitoId}`}>
                  <TableCell>{expedienteDelito.delitoNombre}</TableCell>
                  <TableCell>{expedienteDelito.delitoArticulo || '-'}</TableCell>
                  <TableCell>{expedienteDelito.delitoLey || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={expedienteDelito.delitoEsGrave ? "Grave" : "No Grave"} 
                      color={expedienteDelito.delitoEsGrave ? "error" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDesasociarDelito(expedienteDelito)}
                      disabled={loading}
                      size="small"
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
      
      {/* Diálogo para seleccionar delitos */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Seleccionar Delito</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="Buscar delito por nombre, artículo o ley"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              variant="contained" 
              onClick={handleSearch}
              startIcon={<SearchIcon />}
            >
              Buscar
            </Button>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredDelitos.length === 0 ? (
            <Typography>No se encontraron delitos con ese criterio de búsqueda.</Typography>
          ) : (
            <List>
              {filteredDelitos.map((delito) => {
                // Verificar si el delito ya está asociado para evitar duplicados
                const yaAsociado = delitosAsociados.some(d => d.delitoId === delito.id);
                
                return (
                  <React.Fragment key={delito.id}>
                    <ListItem 
                      secondaryAction={
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<AddIcon />}
                          disabled={yaAsociado}
                          onClick={() => handleAsociarDelito(delito)}
                        >
                          {yaAsociado ? 'Ya asociado' : 'Asociar'}
                        </Button>
                      }
                      sx={{ 
                        opacity: yaAsociado ? 0.6 : 1,
                        '&:hover': {
                          backgroundColor: yaAsociado ? 'transparent' : 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                    >
                      <ListItemText
                        primary={<Box sx={{ fontWeight: 'bold' }}>{delito.nombre}</Box>}
                        secondary={
                          <Box>
                            {delito.articulo && <span>Artículo: {delito.articulo} • </span>}
                            {delito.ley && <span>Ley: {delito.ley} • </span>}
                            <Chip 
                              label={delito.esGrave ? "Grave" : "No Grave"} 
                              color={delito.esGrave ? "error" : "default"}
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            {delito.descripcion && <span>{delito.descripcion}</span>}
                          </Box>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DelitosTab; 