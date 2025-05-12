import React from 'react';
import { Box, Typography, Divider, TextField, Alert } from '@mui/material';
import { Expediente } from '../../types/expediente.types';

interface DetencionGeoTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

const DetencionGeoTab: React.FC<DetencionGeoTabProps> = ({ expediente, onChange }) => {
  const [lat, setLat] = React.useState<string>(expediente.detencionLatitud !== undefined && expediente.detencionLatitud !== null ? String(expediente.detencionLatitud) : '');
  const [lon, setLon] = React.useState<string>(expediente.detencionLongitud !== undefined && expediente.detencionLongitud !== null ? String(expediente.detencionLongitud) : '');

  React.useEffect(() => {
    setLat(expediente.detencionLatitud !== undefined && expediente.detencionLatitud !== null ? String(expediente.detencionLatitud) : '');
    setLon(expediente.detencionLongitud !== undefined && expediente.detencionLongitud !== null ? String(expediente.detencionLongitud) : '');
  }, [expediente.detencionLatitud, expediente.detencionLongitud]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof Expediente, value);
  };

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLat(value);
    if (value === '' || value === '-' || value === '.' || value === '-.') {
      onChange('detencionLatitud', undefined);
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        onChange('detencionLatitud', num);
      } else {
        onChange('detencionLatitud', undefined);
      }
    }
  };

  const handleLonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLon(value);
    if (value === '' || value === '-' || value === '.' || value === '-.') {
      onChange('detencionLongitud', undefined);
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        onChange('detencionLongitud', num);
      } else {
        onChange('detencionLongitud', undefined);
      }
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Punto de Detención
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Lugar"
          name="detencionLugar"
          value={expediente.detencionLugar || ''}
          onChange={handleChange}
          margin="normal"
          size="small"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Latitud"
          name="detencionLatitud"
          value={lat}
          onChange={handleLatChange}
          margin="normal"
          size="small"
          variant="outlined"
          placeholder="Ejemplo: -34.640414"
        />
        <TextField
          fullWidth
          label="Longitud"
          name="detencionLongitud"
          value={lon}
          onChange={handleLonChange}
          margin="normal"
          size="small"
          variant="outlined"
          placeholder="Ejemplo: -59.428054"
        />
        <Alert severity="info" sx={{ mt: 2 }}>
          ¿Cómo obtengo la latitud y longitud?<br />
          1. Busca el lugar en Google Maps.<br />
          2. Haz clic derecho sobre el punto exacto y elige "¿Qué hay aquí?".<br />
          3. Copia los números que aparecen abajo (latitud, longitud) y pégalos aquí.<br />
          <b>Importante:</b> El <b>primer número</b> es la <b>latitud</b> (norte-sur) y el <b>segundo número</b> es la <b>longitud</b> (este-oeste).<br />
          <b>Ejemplo:</b> <code>-34.640414, -59.428054</code><br />
          En este caso: <b>Latitud = -34.640414</b> &nbsp;&nbsp; <b>Longitud = -59.428054</b>
        </Alert>
      </Box>
    </Box>
  );
};

export default DetencionGeoTab; 