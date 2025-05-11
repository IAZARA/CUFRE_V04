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
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import delitoService from '../../api/delitoService';
import { Delito } from '../../types/delito.types';

const DelitosPage: React.FC = () => {
  const [delitos, setDelitos] = useState<Delito[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Paginación
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  const navigate = useNavigate();

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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Lista de Delitos</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nuevo Delito
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Buscar delitos"
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
                  .map((delito) => (
                    <TableRow key={delito.id} hover>
                      <TableCell>{delito.nombre}</TableCell>
                      <TableCell>{delito.codigoPenal || '-'}</TableCell>
                      <TableCell>{delito.tipoPena || '-'}</TableCell>
                      <TableCell>{delito.valoracion !== undefined && delito.valoracion !== null ? delito.valoracion : '-'}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Tooltip title="Editar">
                            <IconButton onClick={() => handleEdit(delito.id!)}>
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton 
                              onClick={() => handleDelete(delito.id!)} 
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
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
          count={filteredDelitos.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
    </Box>
  );
};

export default DelitosPage; 