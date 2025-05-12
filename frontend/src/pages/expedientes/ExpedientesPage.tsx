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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

const ExpedientesPage: React.FC = () => {
  const [expedientes, setExpedientes] = useState<Expediente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Paginación
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  
  const navigate = useNavigate();

  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);
  const [filtroProfugo, setFiltroProfugo] = useState('');
  const [filtroNumero, setFiltroNumero] = useState('');
  const [filtroFuerza, setFiltroFuerza] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

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

  // Opciones únicas para fuerza y estado
  const fuerzasUnicas = Array.from(new Set(expedientes.map(e => (e.fuerzaAsignada || '').toUpperCase()).filter(Boolean)));
  const estadosUnicos = Array.from(new Set(expedientes.map(e => (e.estadoSituacion || '').toUpperCase()).filter(Boolean)));

  // Filtro avanzado
  const expedientesFiltrados = expedientes.filter(expediente => {
    // Filtro por número de expediente
    if (filtroNumero && !expediente.numero.toLowerCase().includes(filtroNumero.toLowerCase())) return false;
    // Filtro por nombre de prófugo
    if (filtroProfugo && !(Array.isArray(expediente.profugos) && expediente.profugos.join(' ').toLowerCase().includes(filtroProfugo.toLowerCase()))) return false;
    // Filtro por fuerza
    if (filtroFuerza && (expediente.fuerzaAsignada || '').toUpperCase() !== filtroFuerza) return false;
    // Filtro por estado
    if (filtroEstado && (expediente.estadoSituacion || '').toUpperCase() !== filtroEstado) return false;
    // Filtro por fecha de inicio
    const fechaStr = expediente.fechaIngreso || expediente.fechaInicio;
    if ((fechaDesde || fechaHasta) && !fechaStr) return false;
    if (fechaStr) {
      const fecha = new Date(fechaStr);
      if (fechaDesde && fecha < fechaDesde) return false;
      if (fechaHasta && fecha > fechaHasta) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Encabezado profesional */}
      <Paper sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, mb: 2, bgcolor: '#002856', color: '#fff', borderRadius: 3, boxShadow: 4 }}>
        <Box sx={{ flex: '0 0 80px', display: 'flex', alignItems: 'center' }}>
          <img src="/images/logo-cufre-2.png" alt="Logo CUFRE" style={{ height: 56, objectFit: 'contain' }} />
        </Box>
        <Typography variant="h4" sx={{ flex: 1, textAlign: 'center', fontWeight: 'bold', letterSpacing: 1 }}>Lista de Expedientes</Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ fontWeight: 'bold', boxShadow: 2 }}
        >
          Nuevo Expediente
        </Button>
      </Paper>
      {/* Barra de filtros */}
      <Paper sx={{ mb: 3, p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', boxShadow: 2, borderRadius: 2 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DatePicker
            label="Fecha de inicio desde"
            value={fechaDesde}
            onChange={setFechaDesde}
            slotProps={{ textField: { size: 'small', sx: { minWidth: 170 } } }}
          />
          <DatePicker
            label="hasta"
            value={fechaHasta}
            onChange={setFechaHasta}
            slotProps={{ textField: { size: 'small', sx: { minWidth: 170 } } }}
          />
        </LocalizationProvider>
        <TextField
          label="Nombre de prófugo"
          size="small"
          value={filtroProfugo}
          onChange={e => setFiltroProfugo(e.target.value)}
          sx={{ minWidth: 180 }}
        />
        <TextField
          label="Número de expediente"
          size="small"
          value={filtroNumero}
          onChange={e => setFiltroNumero(e.target.value)}
          sx={{ minWidth: 180 }}
        />
        <TextField
          label="Fuerza asignada"
          size="small"
          select
          value={filtroFuerza}
          onChange={e => setFiltroFuerza(e.target.value)}
          SelectProps={{ displayEmpty: true }}
          sx={{ minWidth: 160 }}
        >
          <option value="">Todas</option>
          {fuerzasUnicas.map(f => <option key={f} value={f}>{f}</option>)}
        </TextField>
        <TextField
          label="Estado"
          size="small"
          select
          value={filtroEstado}
          onChange={e => setFiltroEstado(e.target.value)}
          SelectProps={{ displayEmpty: true }}
          sx={{ minWidth: 140 }}
        >
          <option value="">Todos</option>
          {estadosUnicos.map(e => <option key={e} value={e}>{e}</option>)}
        </TextField>
        <Button variant="outlined" color="secondary" onClick={() => {
          setFechaDesde(null); setFechaHasta(null); setFiltroProfugo(''); setFiltroNumero(''); setFiltroFuerza(''); setFiltroEstado('');
        }}>Limpiar filtros</Button>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3, boxShadow: 3, borderRadius: 2 }}>
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
              {expedientesFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No se encontraron expedientes
                  </TableCell>
                </TableRow>
              ) : (
                expedientesFiltrados
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
          count={expedientesFiltrados.length}
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