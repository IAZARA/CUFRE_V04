import React, { useEffect, useState } from 'react';
import { Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert } from '@mui/material';

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
        const res = await fetch('/api/actividad-sistema');
        if (!res.ok) throw new Error('Error al obtener la actividad del sistema');
        const data = await res.json();
        setLogs(data);
      } catch (err: any) {
        setError(err.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Actividad del Sistema
      </Typography>
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
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
                  <TableRow key={log.id}>
                    <TableCell>{log.usuario}</TableCell>
                    <TableCell>{log.tipoAccion}</TableCell>
                    <TableCell>{new Date(log.fechaHora).toLocaleString()}</TableCell>
                    <TableCell>{log.detalles}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ActividadSistemaPage; 