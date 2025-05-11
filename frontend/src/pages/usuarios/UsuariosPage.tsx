import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  PersonAddRounded
} from '@mui/icons-material';
import usuarioService from '../../api/usuarioService';
import { Usuario, Rol } from '../../types/usuario.types';
import { useAuth } from '../../context/AuthContext';

const UsuariosPage: React.FC = () => {
  const { user } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Paginación
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  // Estado para el modal de creación/edición
  const [openDialog, setOpenDialog] = useState(false);
  const [currentUsuario, setCurrentUsuario] = useState<Usuario>({
    nombre: '',
    apellido: '',
    email: '',
    username: '',
    password: '',
    rol: Rol.VISUALIZADOR,
    activo: true
  });
  const [isEditMode, setIsEditMode] = useState(false);

  const rolLabels: Record<string, string> = {
    [Rol.SUPERUSUARIO]: 'Superusuario',
    [Rol.ADMINISTRADOR]: 'Administrador',
    [Rol.OPERADOR]: 'Operador',
    [Rol.VISUALIZADOR]: 'Visualizador',
    [Rol.USUARIOCARGA]: 'Usuario Carga',
    [Rol.USUARIOCONSULTA]: 'Usuario Consulta',
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuarioService.getAll();
      setUsuarios(data);
    } catch (err: any) {
      console.error('Error al cargar usuarios:', err);
      setError(err.response?.data?.message || 'Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      usuario.nombre.toLowerCase().includes(searchTermLower) ||
      usuario.apellido.toLowerCase().includes(searchTermLower) ||
      usuario.email.toLowerCase().includes(searchTermLower) ||
      usuario.rol.toLowerCase().includes(searchTermLower)
    );
  });

  const handleOpenDialog = (usuario?: Usuario) => {
    if (usuario) {
      // Modo Edición
      setCurrentUsuario({...usuario, password: ''});
      setIsEditMode(true);
    } else {
      // Modo Creación
      setCurrentUsuario({
        nombre: '',
        apellido: '',
        email: '',
        username: '',
        password: 'Minseg2025-',
        rol: Rol.VISUALIZADOR,
        activo: true
      });
      setIsEditMode(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentUsuario({...currentUsuario, [name]: value});
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const value = e.target.value;
    setCurrentUsuario({
      ...currentUsuario,
      rol: value as Rol
    });
  };

  const handleSaveUsuario = async () => {
    // Validación básica
    if (!currentUsuario.nombre || !currentUsuario.apellido || !currentUsuario.email) {
      setError('Por favor complete todos los campos obligatorios');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (isEditMode) {
        await usuarioService.update(currentUsuario.id!, currentUsuario);
        setSuccess('Usuario actualizado correctamente');
      } else {
        await usuarioService.create(currentUsuario);
        setSuccess('Usuario creado correctamente');
      }
      
      setOpenDialog(false);
      fetchUsuarios(); // Recargar la lista
    } catch (err: any) {
      console.error('Error al guardar usuario:', err);
      setError(err.response?.data?.message || 'Error al guardar el usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (usuario: Usuario) => {
    try {
      setLoading(true);
      const updatedUsuario = { ...usuario, activo: !usuario.activo };
      await usuarioService.update(usuario.id!, updatedUsuario);
      setSuccess(`Usuario ${updatedUsuario.activo ? 'activado' : 'desactivado'} correctamente`);
      fetchUsuarios(); // Recargar la lista
    } catch (err: any) {
      console.error('Error al cambiar estado del usuario:', err);
      setError(err.response?.data?.message || 'Error al cambiar el estado del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        setLoading(true);
        await usuarioService.delete(id);
        setSuccess('Usuario eliminado correctamente');
        fetchUsuarios(); // Recargar la lista
      } catch (err: any) {
        console.error('Error al eliminar usuario:', err);
        setError(err.response?.data?.message || 'Error al eliminar el usuario');
      } finally {
        setLoading(false);
      }
    }
  };

  // Función para determinar si el usuario actual puede editar a otro usuario
  const canEdit = (targetUsuario: Usuario) => {
    // Un usuario no puede editar a alguien con un rol superior
    if (!user) return false;
    
    // SUPERUSUARIO puede editar a cualquiera
    if (user.rol === Rol.SUPERUSUARIO) return true;
    
    // ADMINISTRADOR puede editar a todos menos a SUPERUSUARIO
    if (user.rol === Rol.ADMINISTRADOR && targetUsuario.rol !== Rol.SUPERUSUARIO) return true;
    
    // Cualquier usuario puede editarse a sí mismo
    return user.id === targetUsuario.id;
  };

  const getChipColor = (rol: Rol): "error" | "warning" | "primary" | "info" | "default" => {
    switch (rol) {
      case Rol.SUPERUSUARIO:
        return 'error';
      case Rol.ADMINISTRADOR:
        return 'warning';
      case Rol.OPERADOR:
        return 'primary';
      case Rol.VISUALIZADOR:
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading && usuarios.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Gestión de Usuarios</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Usuario
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

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Buscar usuarios"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Rol</TableCell>
                <TableCell align="center">Estado</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsuarios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No se encontraron usuarios
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsuarios
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((usuario) => (
                    <TableRow key={usuario.id} hover>
                      <TableCell>{usuario.nombre}</TableCell>
                      <TableCell>{usuario.apellido}</TableCell>
                      <TableCell>{usuario.email}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={rolLabels[usuario.rol] || usuario.rol} 
                          color={getChipColor(usuario.rol)} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={usuario.activo ? 'Activo' : 'Inactivo'}
                          color={usuario.activo ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          {canEdit(usuario) && (
                            <>
                              <IconButton onClick={() => handleOpenDialog(usuario)}>
                                <EditIcon />
                              </IconButton>
                              <IconButton 
                                color={usuario.activo ? 'default' : 'success'}
                                onClick={() => handleToggleActive(usuario)}
                              >
                                {usuario.activo ? <BlockIcon /> : <CheckCircleIcon />}
                              </IconButton>
                              <IconButton 
                                color="error"
                                onClick={() => handleDelete(usuario.id!)}
                                disabled={user?.id === usuario.id} // No puede eliminarse a sí mismo
                              >
                                <DeleteIcon />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsuarios.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>

      {/* Diálogo para crear/editar usuario */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, fontSize: 28, fontWeight: 700, pb: 0 }}>
          <PersonAddRounded color="primary" sx={{ fontSize: 36 }} />
          {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        </DialogTitle>
        <Typography variant="subtitle1" sx={{ pl: 7, pb: 2, color: 'text.secondary' }}>
          Complete los datos del usuario
        </Typography>
        <DialogContent sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e3e8ee 100%)', p: 0 }}>
          <Box component={Paper} elevation={3} sx={{ borderRadius: 3, p: { xs: 2, sm: 4 }, m: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  name="nombre"
                  value={currentUsuario.nombre}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  required
                  label="Apellido"
                  name="apellido"
                  value={currentUsuario.apellido}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <TextField
                  fullWidth
                  required
                  label="Email"
                  name="email"
                  type="email"
                  value={currentUsuario.email}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="rol-label">Rol</InputLabel>
                  <Select
                    labelId="rol-label"
                    name="rol"
                    value={currentUsuario.rol}
                    label="Rol"
                    onChange={handleSelectChange}
                  >
                    {user?.rol === Rol.SUPERUSUARIO && (
                      <MenuItem value={Rol.SUPERUSUARIO}>{rolLabels[Rol.SUPERUSUARIO]}</MenuItem>
                    )}
                    {(user?.rol === Rol.SUPERUSUARIO || user?.rol === Rol.ADMINISTRADOR) && (
                      <MenuItem value={Rol.ADMINISTRADOR}>{rolLabels[Rol.ADMINISTRADOR]}</MenuItem>
                    )}
                    <MenuItem value={Rol.USUARIOCARGA}>{rolLabels[Rol.USUARIOCARGA]}</MenuItem>
                    <MenuItem value={Rol.USUARIOCONSULTA}>{rolLabels[Rol.USUARIOCONSULTA]}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ width: { xs: '100%', sm: '48%' } }}>
                <TextField
                  fullWidth
                  required={!isEditMode}
                  label={isEditMode ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                  name="password"
                  type="text"
                  value={currentUsuario.password}
                  onChange={handleInputChange}
                  helperText={isEditMode ? 'Dejar en blanco para mantener la actual' : 'Contraseña por defecto: Minseg2025-'}
                  sx={{ mb: 2 }}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 3, pt: 0 }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="inherit" sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 500 }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveUsuario} 
            variant="contained" 
            color="primary"
            disabled={loading}
            sx={{ borderRadius: 2, px: 3, py: 1, fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsuariosPage; 