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
import expedienteService from '../../api/expedienteService';
import { Expediente } from '../../types/expediente.types';

const ExpedientesPage: React.FC = () => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Paginación
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpedientes();
  }, []);

  const fetchExpedientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await expedienteService.getAll();
      setExpedientes(data);
    } catch (err: any) {
      console.error('Error al cargar expedientes:', err);
      setError(err.response?.data?.message || 'Error al cargar los expedientes');
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

  const filteredExpedientes = expedientes.filter((expediente) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      expediente.numero.toLowerCase().includes(searchTermLower) ||
      expediente.caratula.toLowerCase().includes(searchTermLower) ||
      (expediente.estadoSituacion?.toLowerCase().includes(searchTermLower) || false) ||
      (expediente.jurisdiccion ? expediente.jurisdiccion.toLowerCase().includes(searchTermLower) : false)
    );
  });

  const handleCreate = () => {
    navigate('/expedientes/crear');
  };

  const handleEdit = (id: number) => {
    navigate(`/expedientes/editar/${id}`);
  };

  const handleViewDetails = (id: number) => {
    navigate(`/expedientes/detalle/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro que desea eliminar este expediente?')) {
      try {
        await expedienteService.delete(id);
        fetchExpedientes(); // Recargar la lista
      } catch (err: any) {
        console.error('Error al eliminar expediente:', err);
        setError(err.response?.data?.message || 'Error al eliminar el expediente');
      }
    }
  };

  // Nueva función para obtener el label y color de estado
  const getEstadoInfo = (estado?: string) => {
    const valor = (estado || '').toUpperCase();
    switch (valor) {
      case 'CAPTURA VIGENTE':
        return { label: 'CAPTURA VIGENTE', color: '#ffcccc' };
      case 'DETENIDO':
        return { label: 'DETENIDO', color: '#d0f5d8' };
      case 'SIN EFECTO':
        return { label: 'SIN EFECTO', color: '#ffe5b4' };
      default:
        return { label: 'SIN DATO', color: 'inherit' };
    }
  };

  // Mapeo de fuerza asignada a imagen
  const fuerzaIconos: Record<string, { src: string; alt: string }> = {
    PFA: { src: '/images/icon1.png', alt: 'Policía Federal Argentina' },
    GNA: { src: '/images/Insignia_de_la_Gendarmería_de_Argentina.svg.png', alt: 'Gendarmería Nacional Argentina' },
    PNA: { src: '/images/icon3.png', alt: 'Prefectura Naval Argentina' },
    PSA: { src: '/images/icon4.png', alt: 'Policía de Seguridad Aeroportuaria' },
    INTERPOOL: { src: '/images/interpol.png', alt: 'Interpol' },
    SPF: { src: '/images/Logo_SPF.png', alt: 'Servicio Penitenciario Federal' },
    CUFRE: { src: '/images/logo-cufre-2.png', alt: 'CUFRE' },
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
        <Typography variant="h4">Lista de Expedientes</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Nuevo Expediente
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Buscar expedientes"
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
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                <TableCell sx={{ color: '#1565c0', fontWeight: 'bold' }}>Número Expediente</TableCell>
                <TableCell sx={{ color: '#1565c0', fontWeight: 'bold' }}>Número Causa</TableCell>
                <TableCell sx={{ color: '#1565c0', fontWeight: 'bold' }}>Fecha de Inicio</TableCell>
                <TableCell sx={{ color: '#1565c0', fontWeight: 'bold' }}>Estado</TableCell>
                <TableCell sx={{ color: '#1565c0', fontWeight: 'bold' }}>Prófugo</TableCell>
                <TableCell sx={{ color: '#1565c0', fontWeight: 'bold' }}>Fuerza Asignada</TableCell>
                <TableCell align="center" sx={{ color: '#1565c0', fontWeight: 'bold' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpedientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No se encontraron expedientes
                  </TableCell>
                </TableRow>
              ) : (
                filteredExpedientes
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((expediente, idx) => {
                    const estadoInfo = getEstadoInfo(expediente.estadoSituacion);
                    // Chip de estado
                    let chipColor = 'default';
                    if (estadoInfo.label === 'CAPTURA VIGENTE') chipColor = 'error';
                    else if (estadoInfo.label === 'DETENIDO') chipColor = 'success';
                    else if (estadoInfo.label === 'SIN EFECTO') chipColor = 'warning';
                    // Prófugo visual
                    const tieneProfugo = Array.isArray(expediente.profugos) && expediente.profugos.length > 0;
                    // Alternar color de fila
                    const rowBg = idx % 2 === 0 ? '#fff' : '#fafafa';
                    return (
                      <TableRow
                        key={expediente.id}
                        hover
                        sx={{
                          backgroundColor: rowBg,
                          '&:hover': { backgroundColor: '#e3f2fd' },
                          transition: 'background 0.2s',
                        }}
                      >
                        <TableCell sx={{ fontWeight: 'bold' }}>{expediente.numero}</TableCell>
                        <TableCell>{expediente.numeroCausa}</TableCell>
                        <TableCell>{expediente.fechaIngreso || expediente.fechaInicio}</TableCell>
                        <TableCell>
                          <Chip
                            label={estadoInfo.label}
                            color={chipColor as any}
                            size="small"
                            sx={{ fontWeight: 'bold', fontSize: 14 }}
                          />
                        </TableCell>
                        <TableCell>
                          {tieneProfugo ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span style={{ color: '#1565c0', fontWeight: 700, fontSize: 15 }}>
                                <span role="img" aria-label="persona">👤</span>
                                {expediente.profugos!.map(n => n.toUpperCase()).join(', ')}
                              </span>
                            </Box>
                          ) : (
                            <span style={{ color: '#888' }}>S/D</span>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {(() => {
                            const fuerza = (expediente.fuerzaAsignada || '').toUpperCase();
                            const icono = fuerzaIconos[fuerza];
                            if (icono) {
                              return (
                                <Tooltip title={fuerza} arrow>
                                  <img src={icono.src} alt={icono.alt} style={{ height: 32, display: 'block', margin: '0 auto' }} />
                                </Tooltip>
                              );
                            }
                            return expediente.fuerzaAsignada || '-';
                          })()}
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Tooltip title="Ver detalles">
                              <IconButton onClick={() => handleViewDetails(expediente.id!)}>
                                <VisibilityIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Editar">
                              <IconButton onClick={() => handleEdit(expediente.id!)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Eliminar">
                              <IconButton 
                                onClick={() => handleDelete(expediente.id!)} 
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredExpedientes.length}
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

export default ExpedientesPage; 