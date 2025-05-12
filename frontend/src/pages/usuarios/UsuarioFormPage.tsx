import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid as MuiGrid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Alert,
  CircularProgress
} from '@mui/material';
import { Usuario, Rol } from '../../types/usuario.types';
import usuarioService from '../../api/usuarioService';
import { useAuth } from '../../context/AuthContext';

const UsuarioFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [usuario, setUsuario] = useState<Usuario>({
    id: undefined,
    nombre: '',
    apellido: '',
    email: '',
    username: '',
    rol: Rol.ADMINISTRADOR,
    password: '',
    dependencia: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const rolLabels: Record<string, string> = {
    [Rol.SUPERUSUARIO]: 'Superusuario',
    [Rol.ADMINISTRADOR]: 'Administrador',
    [Rol.USUARIOCARGA]: 'Usuario Carga',
    [Rol.USUARIOCONSULTA]: 'Usuario Consulta',
  };

  // Cargar usuario si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      const fetchUsuario = async () => {
        try {
          setLoading(true);
          const data = await usuarioService.getById(parseInt(id));
          setUsuario({
            ...data,
            // No se pasa la contraseña en modo edición
            password: ''
          });
        } catch (err: any) {
          setError(err.message || 'Error al cargar el usuario');
        } finally {
          setLoading(false);
        }
      };

      fetchUsuario();
    }
  }, [id, isEditMode]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!usuario.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!usuario.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }
    
    if (!usuario.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(usuario.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (!usuario.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!isEditMode && !usuario.password) {
      newErrors.password = 'La contraseña es requerida para nuevos usuarios';
    } else if (!isEditMode && usuario.password && usuario.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<{ name?: string, value: unknown }>) => {
    const name = e.target.name as keyof Usuario;
    const value = e.target.value;
    setUsuario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Limpiar estados previos
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Si username está vacío, usar el email
    const usuarioParaCrear = {
      ...usuario,
      username: usuario.username && usuario.username.trim() !== '' ? usuario.username : usuario.email
    };

    // Establecer un timeout para evitar carga infinita
    const timeoutId = setTimeout(() => {
      setLoading(false);
      setError('La operación ha tardado demasiado tiempo. Por favor, inténtelo de nuevo.');
    }, 15000); // 15 segundos de timeout

    try {
      if (isEditMode) {
        await usuarioService.update(parseInt(id), usuarioParaCrear);
        clearTimeout(timeoutId); // Limpiar timeout si la operación fue exitosa
        setSuccess('Usuario actualizado correctamente');
      } else {
        await usuarioService.create(usuarioParaCrear);
        clearTimeout(timeoutId); // Limpiar timeout si la operación fue exitosa
        setSuccess('Usuario creado correctamente');
      }

      // Redireccionar después de un breve retraso solo si no hubo errores
      setTimeout(() => {
        navigate('/usuarios');
      }, 1500);
    } catch (err: any) {
      clearTimeout(timeoutId); // Limpiar timeout si hubo un error
      console.error('Error en formulario de usuario:', err);
      let errorMsg = 'Ha ocurrido un error al guardar el usuario';

      // Extraer mensaje de error más detallado si está disponible
      if (err.response?.data?.mensaje) {
        errorMsg = err.response.data.mensaje;
      } else if (err.message) {
        errorMsg = err.message;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Mostrar indicador de carga solo durante la carga inicial de datos, no durante el envío del formulario
  if (loading && isEditMode && !success && !error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <div className="grid-container">
            <div className="grid-item width-6 width-xs-12">
              <TextField
                fullWidth
                required
                label="Nombre"
                name="nombre"
                value={usuario.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />
            </div>
            
            <div className="grid-item width-6 width-xs-12">
              <TextField
                fullWidth
                required
                label="Apellido"
                name="apellido"
                value={usuario.apellido}
                onChange={handleChange}
                error={!!errors.apellido}
                helperText={errors.apellido}
              />
            </div>
            
            <div className="grid-item full-width">
              <TextField
                fullWidth
                required
                label="Email"
                name="email"
                type="email"
                value={usuario.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </div>
            
            <div className="grid-item width-6 width-xs-12">
              <TextField
                fullWidth
                required
                label="Nombre de Usuario"
                name="username"
                value={usuario.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
              />
            </div>
            <div className="grid-item width-6 width-xs-12">
              <TextField
                fullWidth
                label="Dependencia"
                name="dependencia"
                value={usuario.dependencia || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid-item width-6 width-xs-12">
              <FormControl fullWidth>
                <InputLabel id="rol-label">Rol</InputLabel>
                <Select
                  labelId="rol-label"
                  id="rol"
                  name="rol"
                  value={usuario.rol === Rol.USUARIOCARGA || usuario.rol === Rol.USUARIOCONSULTA ? Rol.ADMINISTRADOR : usuario.rol}
                  label="Rol"
                  onChange={(e) => {
                    setUsuario(prev => ({ ...prev, rol: e.target.value as Rol }));
                  }}
                >
                  {Object.values(Rol).map((rol) => (
                    <MenuItem key={rol} value={rol}>
                      {rolLabels[rol] || rol}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            
            <div className="grid-item width-6 width-xs-12">
              <TextField
                fullWidth
                required={!isEditMode}
                label="Contraseña"
                name="password"
                type="password"
                value={usuario.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={isEditMode 
                  ? 'Dejar en blanco para mantener la contraseña actual' 
                  : errors.password
                }
              />
            </div>
            
            <div className="grid-item full-width">
              <Box display="flex" justifyContent="flex-end" mt={2}>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/usuarios')}
                  sx={{ mr: 1 }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{ minWidth: '120px', position: 'relative' }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={24} sx={{ position: 'absolute' }} />
                      <span style={{ visibility: 'hidden' }}>{isEditMode ? 'Actualizar' : 'Crear'}</span>
                    </>
                  ) : (
                    isEditMode ? 'Actualizar' : 'Crear'
                  )}
                </Button>
              </Box>
            </div>
          </div>
        </Box>
      </Paper>
    </Box>
  );
};

export default UsuarioFormPage; 