import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Gavel as GavelIcon,
  Star as StarIcon
} from '@mui/icons-material';
import delitoService from '../../api/delitoService';
import { Delito } from '../../types/delito.types';
import { useAuth } from '../../context/AuthContext';
import { Rol } from '../../types/usuario.types';

const DelitosPage: React.FC = () => {
  const [delitos, setDelitos] = useState<Delito[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Paginación
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const isCarga = user?.rol === Rol.USUARIOCARGA;
  const isConsulta = user?.rol === Rol.USUARIOCONSULTA;
  const isAdmin = user?.rol === Rol.ADMINISTRADOR;
  const isSuper = user?.rol === Rol.SUPERUSUARIO;

  useEffect(() => {
    fetchDelitos();
  }, []);

  const fetchDelitos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await delitoService.getAll();
      // Mapear campos del backend a los del frontend
      const mapped = data.map((delito: any) => ({
        ...delito,
        codigoPenal: delito.codigoPenal || '',
        tipoPena: delito.tipoPena || '',
        valoracion: delito.valoracion,
      }));
      setDelitos(mapped);
    } catch (err: any) {
      console.error('Error al cargar delitos:', err);
      setError(err.response?.data?.message || 'Error al cargar la lista de delitos');
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

  const filteredDelitos = delitos.filter((delito) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      delito.nombre.toLowerCase().includes(searchTermLower) ||
      (delito.articulo && delito.articulo.toLowerCase().includes(searchTermLower)) ||
      (delito.ley && delito.ley.toLowerCase().includes(searchTermLower)) ||
      (delito.descripcion && delito.descripcion.toLowerCase().includes(searchTermLower))
    );
  });

  const handleCreate = () => {
    navigate('/delitos/crear');
  };

  const handleEdit = (id: number) => {
    navigate(`/delitos/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro que desea eliminar este delito?')) {
      try {
        await delitoService.delete(id);
        fetchDelitos(); // Recargar la lista
      } catch (err: any) {
        console.error('Error al eliminar delito:', err);
        setError(err.response?.data?.message || 'Error al eliminar el delito');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Encabezado moderno */}
      <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', borderRadius: 2, background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)', boxShadow: 4 }}>
        <GavelIcon sx={{ color: 'white', fontSize: 40, mr: 2 }} />
        <Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, letterSpacing: 1 }}>
            Lista de Delitos
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.85)' }}>
            Gestión y consulta de delitos registrados en el sistema
          </Typography>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {(isSuper || isAdmin) && (
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ minWidth: 150, fontWeight: 600, boxShadow: 3, borderRadius: 2, ml: 2, transition: '0.2s', '&:hover': { boxShadow: 6, transform: 'scale(1.04)' } }}
        >
          Nuevo Delito
        </Button>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Buscador moderno */}
      <Paper sx={{ mb: 3, boxShadow: 2, borderRadius: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Buscar delitos"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ background: 'white', borderRadius: 2, boxShadow: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#1976d2' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Tabla moderna */}
        <TableContainer sx={{ borderRadius: 2, boxShadow: 0 }}>
          <Table stickyHeader sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <TableHead>
              <TableRow
                sx={{
                  background: '#0d223a',
                  '& th': {
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 17,
                    letterSpacing: 0.5,
                    textShadow: '0 1px 4px rgba(0,0,0,0.18)',
                    borderBottom: '3px solid #1976d2',
                    background: 'inherit',
                  },
                }}
              >
                <TableCell>Nombre</TableCell>
                <TableCell>Código Penal</TableCell>
                <TableCell>Tipo de Pena</TableCell>
                <TableCell>Valoración Asignada</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDelitos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No se encontraron delitos
                  </TableCell>
                </TableRow>
              ) : (
                filteredDelitos
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((delito, idx) => (
                    <TableRow
                      key={delito.id}
                      hover
                      sx={{
                        backgroundColor: idx % 2 === 0 ? '#f5f7fa' : '#e3eafc',
                        transition: 'background 0.2s',
                        '&:hover': { backgroundColor: '#bbdefb' },
                      }}
                    >
                      <TableCell sx={{ fontWeight: 500 }}>{delito.nombre}</TableCell>
                      <TableCell>{delito.codigoPenal || '-'}</TableCell>
                      <TableCell>{delito.tipoPena || '-'}</TableCell>
                      <TableCell>
                        {delito.valoracion !== undefined && delito.valoracion !== null ? (
                          delito.valoracion >= 700 ? (
                            <Chip label={delito.valoracion} color="error" size="small" icon={<StarIcon sx={{ color: 'gold' }} />} />
                          ) : (
                            <Chip label={delito.valoracion} color="primary" size="small" />
                          )
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          {!(isCarga || isConsulta) && (
                          <Tooltip title="Editar">
                            <IconButton onClick={() => handleEdit(delito.id!)} color="primary" sx={{ borderRadius: 2 }}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          )}
                          {!(isCarga || isConsulta) && (
                          <Tooltip title="Eliminar">
                            <IconButton 
                              onClick={() => handleDelete(delito.id!)} 
                              color="error"
                              sx={{ borderRadius: 2 }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
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
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredDelitos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          sx={{ borderTop: '1px solid #e0e0e0', background: '#f5f7fa', borderRadius: 2 }}
        />
      </Paper>
    </Box>
  );
};

export default DelitosPage; 