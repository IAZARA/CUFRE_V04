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
import Autocomplete from '@mui/material/Autocomplete';

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
          // Mapear para compatibilidad con la UI
          const asociadosMapeados = asociados.map((rel: any) => ({
            id: rel.id,
            expedienteId: rel.expedienteId,
            delitoId: rel.delitoId,
            delitoNombre: rel.delito?.nombre || '',
            delitoCodigoPenal: rel.delito?.codigoPenal || '',
            delitoTipoPena: rel.delito?.tipoPena || '',
            fechaRegistro: rel.fechaRegistro,
            observaciones: rel.observaciones
          }));
          setDelitosAsociados(asociadosMapeados);
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
        delitoCodigoPenal: delito.codigoPenal || '',
        delitoTipoPena: delito.tipoPena || '',
        fechaRegistro: new Date().toISOString().split('T')[0],
        observaciones: ''
      };
      
      const updatedDelitos = [...delitosAsociados, nuevoDelitoAsociado];
      setDelitosAsociados(updatedDelitos);
      
      // Actualizar el campo delitos en el expediente
      const delitosObj = updatedDelitos.map(d => ({ id: d.delitoId }));
      onChange('delitos', delitosObj);
      
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
          delitoCodigoPenal: delito.codigoPenal || '',
          delitoTipoPena: delito.tipoPena || '',
        };
        
        const updatedDelitos = [...delitosAsociados, delitoCompleto];
        setDelitosAsociados(updatedDelitos);
        
        // Actualizar el campo delitos en el expediente
        const delitosObj = updatedDelitos.map(d => ({ id: d.delitoId }));
        onChange('delitos', delitosObj);
        
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
      const delitosObj = updatedDelitos.map(d => ({ id: d.delitoId }));
      onChange('delitos', delitosObj);
      
      return;
    }
    
    // Si el expediente tiene ID, llamar al API para desasociar
    setLoading(true);
    delitoService.desasociarDelitoExpediente(expedienteDelito.id || 0)
      .then(() => {
        const updatedDelitos = delitosAsociados.filter(d => d.id !== expedienteDelito.id);
        setDelitosAsociados(updatedDelitos);
        
        // Actualizar el campo delitos en el expediente
        const delitosObj = updatedDelitos.map(d => ({ id: d.delitoId }));
        onChange('delitos', delitosObj);
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
          <Table sx={{ minWidth: 650, borderRadius: 2, overflow: 'hidden' }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976d2' }}>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Delito</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Código Penal</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Tipo de Pena</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {delitosAsociados.map((expedienteDelito, idx) => (
                <TableRow
                  key={expedienteDelito.id ? `rel-${expedienteDelito.id}` : `delito-${expedienteDelito.delitoId}`}
                  sx={{
                    backgroundColor: idx % 2 === 0 ? '#f5f7fa' : '#e3eaf2',
                    '&:hover': { backgroundColor: '#e0f2f1' },
                  }}
                >
                  <TableCell sx={{ fontSize: 15 }}>{expedienteDelito.delitoNombre}</TableCell>
                  <TableCell sx={{ fontSize: 15 }}>{expedienteDelito.delitoCodigoPenal ?? '-'}</TableCell>
                  <TableCell sx={{ fontSize: 15 }}>{expedienteDelito.delitoTipoPena ?? '-'}</TableCell>
                  <TableCell sx={{ textAlign: 'center' }}>
                    <IconButton color="error" onClick={() => handleDesasociarDelito(expedienteDelito)}>
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
        <DialogContent sx={{ pt: 3 }}>
          <Box
            sx={{
              mb: 2,
              mt: 2,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 1,
              alignItems: { xs: 'stretch', sm: 'center' }
            }}
          >
            <Autocomplete
              freeSolo
              options={delitosDisponibles.map((d) => d.nombre)}
              inputValue={searchTerm}
              onInputChange={(_, value) => setSearchTerm(value)}
              onChange={(_, value) => setSearchTerm(value || '')}
              sx={{ flex: 1, minWidth: 250 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Buscar delito por nombre, artículo o ley"
                  variant="outlined"
                />
              )}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              startIcon={<SearchIcon />}
              sx={{
                minWidth: 110,
                px: 2,
                py: 1.5,
                alignSelf: { xs: 'stretch', sm: 'auto' },
                fontWeight: 'bold',
                fontSize: 16
              }}
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
                const yaAsociado = delitosAsociados.some(d => d.delitoId === delito.id);
                const mostrarDescripcion = delito.descripcion && delito.descripcion !== delito.nombre;

                return (
                  <React.Fragment key={delito.id}>
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 1,
                        opacity: yaAsociado ? 0.6 : 1,
                        '&:hover': {
                          backgroundColor: yaAsociado ? 'transparent' : 'rgba(0, 0, 0, 0.04)'
                        }
                      }}
                      secondaryAction={
                        <Button
                          variant="outlined"
                          color="primary"
                          startIcon={<AddIcon />}
                          disabled={yaAsociado}
                          onClick={() => handleAsociarDelito(delito)}
                          sx={{
                            minWidth: 120,
                            whiteSpace: 'nowrap',
                            ml: { xs: 0, sm: 2 }
                          }}
                        >
                          {yaAsociado ? 'Ya asociado' : 'Asociar'}
                        </Button>
                      }
                    >
                      <Box sx={{
                        maxWidth: { xs: '100%', sm: '70%' }
                      }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                        >
                          {delito.nombre}
                        </Typography>
                        {mostrarDescripcion && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {delito.descripcion}
                          </Typography>
                        )}
                      </Box>
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