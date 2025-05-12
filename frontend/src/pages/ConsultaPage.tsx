import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import expedienteService from '../api/expedienteService';

const ConsultaPage: React.FC = () => {
  const [tipoBusqueda, setTipoBusqueda] = useState<'expediente' | 'persona' | 'ambos'>('ambos');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [expediente, setExpediente] = useState('');
  const [numeroIdentificacion, setNumeroIdentificacion] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleBuscar = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await expedienteService.buscarAvanzado({
        nombre,
        apellido,
        numeroExpediente: expediente,
        tipoBusqueda,
        numeroIdentificacion,
      });
      setResultados(data);
    } catch (e) {
      setResultados([]);
      setError('Error al realizar la búsqueda.');
    }
    setLoading(false);
  };

  return (
    <Box sx={{ maxWidth: 1100, mx: 'auto', mt: 4, mb: 4 }}>
      {/* Encabezado */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3, background: 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)', color: 'white' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Consulta de Expedientes y Personas
        </Typography>
        <Typography variant="subtitle1" sx={{ opacity: 0.92 }}>
          Utiliza los filtros para buscar expedientes o personas en el sistema.
        </Typography>
      </Paper>

      {/* Filtros de búsqueda */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            sx={{ flex: 1, minWidth: 180 }}
          />
          <TextField
            label="Apellido"
            value={apellido}
            onChange={e => setApellido(e.target.value)}
            sx={{ flex: 1, minWidth: 180 }}
          />
          <TextField
            label="N° Expediente"
            value={expediente}
            onChange={e => setExpediente(e.target.value)}
            sx={{ flex: 1, minWidth: 180 }}
          />
          <TextField
            label="N° Identificación"
            value={numeroIdentificacion}
            onChange={e => setNumeroIdentificacion(e.target.value)}
            sx={{ flex: 1, minWidth: 180 }}
          />
          <FormControl sx={{ flex: 1, minWidth: 180 }}>
            <InputLabel>Tipo de Búsqueda</InputLabel>
            <Select
              value={tipoBusqueda}
              label="Tipo de Búsqueda"
              onChange={e => setTipoBusqueda(e.target.value as any)}
            >
              <MenuItem value="ambos">Ambos</MenuItem>
              <MenuItem value="expediente">Expediente</MenuItem>
              <MenuItem value="persona">Persona</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleBuscar}
            sx={{ minWidth: 140, height: 56 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : 'Buscar'}
          </Button>
        </Box>
      </Paper>

      {/* Resultados */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Resultados
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
        )}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipo</TableCell>
                <TableCell>Nombre/Expediente</TableCell>
                <TableCell>Detalle</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resultados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ color: 'gray' }}>
                    No hay resultados para mostrar.
                  </TableCell>
                </TableRow>
              ) : (
                resultados.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.tipo}</TableCell>
                    <TableCell>{row.nombre || row.expediente}</TableCell>
                    <TableCell>{row.detalle}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ConsultaPage; 