import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  Container
} from '@mui/material';
import axiosClient from '../api/axiosClient';

interface ActividadSistema {
  id: number;
  usuario: string;
  tipoAccion: string;
  fechaHora: string;
  detalles: string;
}

const ActividadSistemaPage: React.FC = () => {
  const [logs, setLogs] = useState<ActividadSistema[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get('/api/actividad-sistema');

        // Ordenar por fecha descendente (más recientes primero)
        const actividadesOrdenadas = [...response.data].sort((a, b) =>
          new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime()
        );

        setLogs(actividadesOrdenadas);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Error desconocido');
        console.error("Error al obtener actividades:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Función para obtener el color del chip según el tipo de acción
  const getChipColor = (tipoAccion: string): "success" | "primary" | "error" | "info" | "warning" | "default" => {
    switch (tipoAccion) {
      case 'LOGIN':
        return 'success';
      case 'CREAR_EXPEDIENTE':
        return 'primary';
      case 'EDITAR_EXPEDIENTE':
        return 'info';
      case 'ELIMINAR_EXPEDIENTE':
        return 'error';
      case 'LOGOUT':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Formatear fecha/hora
  const formatearFechaHora = (fechaString: string) => {
    try {
      return new Date(fechaString).toLocaleString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return fechaString;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Actividad del Sistema
        </Typography>

        <Typography variant="body1" color="textSecondary" paragraph>
          Registro de acciones realizadas por los usuarios en el sistema.
        </Typography>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}

        {!loading && !error && (
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><b>Usuario</b></TableCell>
                  <TableCell><b>Acción</b></TableCell>
                  <TableCell><b>Fecha/Hora</b></TableCell>
                  <TableCell><b>Detalles</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">No hay actividad registrada.</TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>{log.usuario}</TableCell>
                      <TableCell>
                        <Chip
                          label={log.tipoAccion}
                          color={getChipColor(log.tipoAccion)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>{formatearFechaHora(log.fechaHora)}</TableCell>
                      <TableCell>{log.detalles || "-"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default ActividadSistemaPage; 