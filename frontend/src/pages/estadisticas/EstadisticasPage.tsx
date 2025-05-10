import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import DateRangeIcon from '@mui/icons-material/DateRange';
import estadisticaService from '../../api/estadisticaService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ff7c43', '#ffa600'];

interface EstadisticasParameters {
  fechaInicio: string;
  fechaFin: string;
  tipoAgrupacion: string;
}

const EstadisticasPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Parámetros de filtrado
  const [parametros, setParametros] = useState<EstadisticasParameters>({
    fechaInicio: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // 1 enero del año actual
    fechaFin: new Date().toISOString().split('T')[0], // Hoy
    tipoAgrupacion: 'mensual'
  });
  
  // Datos para los gráficos
  const [expedientesPorProvincia, setExpedientesPorProvincia] = useState<any[]>([]);
  const [expedientesPorDelito, setExpedientesPorDelito] = useState<any[]>([]);
  const [expedientesPorEstado, setExpedientesPorEstado] = useState<any[]>([]);
  const [expedientesPorTiempo, setExpedientesPorTiempo] = useState<any[]>([]);
  const [expedientesPorTipoCaptura, setExpedientesPorTipoCaptura] = useState<any[]>([]);
  const [estadisticasGenerales, setEstadisticasGenerales] = useState<any>({});
  const [expedientesPeriodo, setExpedientesPeriodo] = useState<any>({});

  useEffect(() => {
    fetchEstadisticas();
  }, []);

  const fetchEstadisticas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar todas las estadísticas en paralelo
      const [
        dataProvincia, 
        dataDelito, 
        dataEstado,
        dataTipoCaptura,
        dataTiempo,
        dataGenerales
      ] = await Promise.all([
        estadisticaService.getExpedientesPorProvincia(),
        estadisticaService.getExpedientesPorDelito(),
        estadisticaService.getExpedientesPorEstado(),
        estadisticaService.getExpedientesPorTipoCaptura(),
        estadisticaService.getExpedientesPorTiempo(),
        estadisticaService.getEstadisticasGenerales()
      ]);
      
      setExpedientesPorProvincia(dataProvincia);
      setExpedientesPorDelito(dataDelito);
      setExpedientesPorEstado(dataEstado);
      setExpedientesPorTipoCaptura(dataTipoCaptura);
      setExpedientesPorTiempo(dataTiempo);
      setEstadisticasGenerales(dataGenerales);
    } catch (err: any) {
      console.error('Error al cargar estadísticas:', err);
      setError(err.response?.data?.message || 'Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const handleParametroChange = (param: keyof EstadisticasParameters) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setParametros({
      ...parametros,
      [param]: event.target.value
    });
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { value: string; name: string } }) => {
    setParametros({
      ...parametros,
      [event.target.name as string]: event.target.value,
    });
  };

  const handleApplyFilters = async () => {
    try {
      setLoading(true);
      const periodoData = await estadisticaService.getExpedientesPorPeriodo(
        parametros.fechaInicio,
        parametros.fechaFin
      );
      setExpedientesPeriodo(periodoData);
    } catch (err: any) {
      console.error('Error al cargar estadísticas por período:', err);
      setError(err.response?.data?.message || 'Error al cargar las estadísticas por período');
    } finally {
      setLoading(false);
    }
  };

  // Usar datos de la API o datos de ejemplo cuando no hay datos
  const dataProvincia = expedientesPorProvincia.length > 0 ? expedientesPorProvincia : [];
  const dataDelito = expedientesPorDelito.length > 0 ? expedientesPorDelito : [];
  const dataEstado = expedientesPorEstado.length > 0 ? expedientesPorEstado : [];
  const dataTipoCaptura = expedientesPorTipoCaptura.length > 0 ? expedientesPorTipoCaptura : [];
  const dataTiempo = expedientesPorTiempo.length > 0 ? expedientesPorTiempo : [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Estadísticas
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Resumen de estadísticas generales */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Box sx={{ width: { xs: '100%', md: '32%' } }}>
          <Card>
            <CardHeader title="Total de Expedientes" />
            <Divider />
            <CardContent>
              <Typography variant="h3" align="center">
                {estadisticasGenerales.totalExpedientes || 0}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ width: { xs: '100%', sm: '23%' } }}>
            <TextField
              fullWidth
              label="Fecha Inicio"
              type="date"
              value={parametros.fechaInicio}
              onChange={handleParametroChange('fechaInicio')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '23%' } }}>
            <TextField
              fullWidth
              label="Fecha Fin"
              type="date"
              value={parametros.fechaFin}
              onChange={handleParametroChange('fechaFin')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '23%' } }}>
            <FormControl fullWidth>
              <InputLabel>Agrupación</InputLabel>
              <Select
                name="tipoAgrupacion"
                value={parametros.tipoAgrupacion}
                label="Agrupación"
                onChange={handleSelectChange}
              >
                <MenuItem value="diaria">Diaria</MenuItem>
                <MenuItem value="semanal">Semanal</MenuItem>
                <MenuItem value="mensual">Mensual</MenuItem>
                <MenuItem value="trimestral">Trimestral</MenuItem>
                <MenuItem value="anual">Anual</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: '23%' } }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<DateRangeIcon />}
              onClick={handleApplyFilters}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Aplicar Filtros'}
            </Button>
          </Box>
        </Box>

        {expedientesPeriodo && expedientesPeriodo.total && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">
              Total en el período: {expedientesPeriodo.total}
            </Typography>
          </Box>
        )}
      </Paper>

      {loading && !expedientesPorProvincia.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Gráfico: Expedientes por tiempo */}
          <Box sx={{ width: '100%' }}>
            <Card>
              <CardHeader 
                title="Expedientes por Período" 
                subheader={`Período: ${parametros.fechaInicio} al ${parametros.fechaFin}`} 
              />
              <Divider />
              <CardContent sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dataTiempo}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cantidad"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Gráfico: Expedientes por Provincia (mapa de barras) */}
          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Card>
              <CardHeader title="Expedientes por Provincia" />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dataProvincia}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      fill="#8884d8" 
                      name="Cantidad"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Gráfico: Expedientes por Tipo Captura */}
          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Card>
              <CardHeader title="Expedientes por Tipo de Captura" />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataTipoCaptura}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {dataTipoCaptura.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Gráfico: Expedientes por Estado */}
          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Card>
              <CardHeader title="Expedientes por Estado" />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataEstado}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {dataEstado.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>

          {/* Gráfico: Expedientes por Delito */}
          <Box sx={{ width: { xs: '100%', md: '48%' } }}>
            <Card>
              <CardHeader title="Expedientes por Delito" />
              <Divider />
              <CardContent sx={{ height: 400 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataDelito}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {dataDelito.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default EstadisticasPage; 