import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import delitoService from '../../api/delitoService';
import { Delito } from '../../types/delito.types';

const DelitoFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Estado para el delito
  const [delito, setDelito] = useState<Delito>({
    nombre: '',
    descripcion: '',
    articulo: '',
    codigo: '',
    ley: '',
    esGrave: false,
    observaciones: ''
  });
  
  // Estado para la UI
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingData, setLoadingData] = useState<boolean>(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Cargar datos del delito si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      fetchDelito();
    }
  }, [id]);

  const fetchDelito = async () => {
    try {
      setLoadingData(true);
      const data = await delitoService.getById(Number(id));
      setDelito(data);
    } catch (err: any) {
      console.error('Error al cargar delito:', err);
      setError(err.response?.data?.message || 'Error al cargar los datos del delito');
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setDelito({ ...delito, [name]: fieldValue });
  };

  const handleSave = async () => {
    // Validación básica
    if (!delito.nombre) {
      setError('Por favor complete al menos el nombre del delito');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      if (isEditMode) {
        await delitoService.update(Number(id), delito);
        setSuccess('Delito actualizado correctamente');
      } else {
        const result = await delitoService.create(delito);
        setSuccess('Delito creado correctamente');
        
        // Redirigir a la edición del delito recién creado
        setTimeout(() => {
          navigate(`/delitos/editar/${result.id}`);
        }, 2000);
      }
    } catch (err: any) {
      console.error('Error al guardar delito:', err);
      setError(err.response?.data?.message || 'Error al guardar el delito');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/delitos')}
            sx={{ mr: 2 }}
          >
            Volver
          </Button>
          <Typography variant="h4">
            {isEditMode ? `Editar Delito: ${delito.nombre}` : 'Crear Nuevo Delito'}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading}
        >
          Guardar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <TextField
              fullWidth
              required
              label="Nombre del Delito"
              name="nombre"
              value={delito.nombre}
              onChange={handleInputChange}
              helperText="Nombre o tipo de delito (ej: Robo, Homicidio, etc.)"
            />
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            <Box sx={{ width: { xs: '100%', sm: 'calc(33.33% - 2rem)' } }}>
              <TextField
                fullWidth
                label="Artículo"
                name="articulo"
                value={delito.articulo || ''}
                onChange={handleInputChange}
                helperText="Número de artículo (ej: 164)"
              />
            </Box>
            
            <Box sx={{ width: { xs: '100%', sm: 'calc(33.33% - 2rem)' } }}>
              <TextField
                fullWidth
                label="Código"
                name="codigo"
                value={delito.codigo || ''}
                onChange={handleInputChange}
                helperText="Código al que corresponde (ej: Código Penal)"
              />
            </Box>
            
            <Box sx={{ width: { xs: '100%', sm: 'calc(33.33% - 2rem)' } }}>
              <TextField
                fullWidth
                label="Ley"
                name="ley"
                value={delito.ley || ''}
                onChange={handleInputChange}
                helperText="Número de ley (ej: 11.723)"
              />
            </Box>
          </Box>
          
          <Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Descripción"
              name="descripcion"
              value={delito.descripcion || ''}
              onChange={handleInputChange}
              helperText="Descripción detallada del delito"
            />
          </Box>
          
          <Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Observaciones Adicionales"
              name="observaciones"
              value={delito.observaciones || ''}
              onChange={handleInputChange}
              helperText="Cualquier información adicional relevante"
            />
          </Box>
          
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={delito.esGrave || false}
                  onChange={handleInputChange}
                  name="esGrave"
                  color="error"
                />
              }
              label="Calificar como Delito Grave"
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              Marque esta opción para delitos de alta gravedad que requieran atención especial
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DelitoFormPage; 