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
  CircularProgress,
  InputAdornment
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
      {/* Encabezado mejorado */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', borderRadius: 2, background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)' }}>
        <Button
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/delitos')}
          sx={{ color: 'white', mr: 2, background: 'rgba(255,255,255,0.08)', '&:hover': { background: 'rgba(255,255,255,0.18)' } }}
        >
          Volver
        </Button>
        <Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
            {isEditMode ? 'Editar Delito' : 'Crear Nuevo Delito'}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
            {isEditMode ? 'Modifica los datos del delito seleccionado.' : 'Completa el formulario para registrar un nuevo delito.'}
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading}
          sx={{ minWidth: 120, fontWeight: 600, boxShadow: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Guardar'}
        </Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, animation: 'fadein 0.5s' }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3, animation: 'fadein 0.5s' }}>
          {success}
        </Alert>
      )}

      {/* Formulario mejorado */}
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ width: '100%' }}>
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
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' } }}>
            <TextField
              fullWidth
              label="Código Penal"
              name="codigoPenal"
              value={delito.codigoPenal || ''}
              onChange={handleInputChange}
              helperText="Ejemplo: Art. 79 CP"
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' } }}>
            <TextField
              fullWidth
              label="Tipo de Pena"
              name="tipoPena"
              value={delito.tipoPena || ''}
              onChange={handleInputChange}
              helperText="Ejemplo: Prisión, Reclusión, etc."
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' } }}>
            <TextField
              fullWidth
              label="Valoración Asignada"
              name="valoracion"
              type="number"
              value={delito.valoracion !== undefined && delito.valoracion !== null ? delito.valoracion : ''}
              onChange={handleInputChange}
              helperText="Valor numérico (ej: 10)"
              InputProps={{
                startAdornment: <InputAdornment position="start">#</InputAdornment>,
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '50%', md: '33.33%' } }}>
            <FormControlLabel
              control={
                <Switch
                  checked={!!delito.esGrave}
                  onChange={handleInputChange}
                  name="esGrave"
                  color="primary"
                />
              }
              label="¿Es grave?"
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Descripción"
              name="descripcion"
              value={delito.descripcion || ''}
              onChange={handleInputChange}
              helperText="Descripción breve del delito"
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Observaciones"
              name="observaciones"
              value={delito.observaciones || ''}
              onChange={handleInputChange}
              helperText="Observaciones adicionales (opcional)"
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default DelitoFormPage; 