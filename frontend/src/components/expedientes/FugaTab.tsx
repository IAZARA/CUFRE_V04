import React from 'react';
import { Box, Typography, Divider, TextField, Alert } from '@mui/material';
import { Expediente } from '../../types/expediente.types';

interface FugaTabProps {
  expediente: Expediente;
  onChange: (field: keyof Expediente, value: any) => void;
}

// Estado local para los campos de lat/lon como string
const FugaTab: React.FC<FugaTabProps> = ({ expediente, onChange }) => {
  const [lat, setLat] = React.useState<string>(expediente.fugaLatitud !== undefined && expediente.fugaLatitud !== null ? String(expediente.fugaLatitud) : '');
  const [lon, setLon] = React.useState<string>(expediente.fugaLongitud !== undefined && expediente.fugaLongitud !== null ? String(expediente.fugaLongitud) : '');

  React.useEffect(() => {
    setLat(expediente.fugaLatitud !== undefined && expediente.fugaLatitud !== null ? String(expediente.fugaLatitud) : '');
    setLon(expediente.fugaLongitud !== undefined && expediente.fugaLongitud !== null ? String(expediente.fugaLongitud) : '');
  }, [expediente.fugaLatitud, expediente.fugaLongitud]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange(name as keyof Expediente, value);
  };

  const handleLatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLat(value);
    // Solo guardar como número si es un número válido, si no, guardar string vacío
    if (value === '' || value === '-' || value === '.' || value === '-.') {
      onChange('fugaLatitud', undefined);
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        onChange('fugaLatitud', num);
      } else {
        onChange('fugaLatitud', undefined);
      }
    }
  };

  const handleLonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLon(value);
    if (value === '' || value === '-' || value === '.' || value === '-.') {
      onChange('fugaLongitud', undefined);
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        onChange('fugaLongitud', num);
      } else {
        onChange('fugaLongitud', undefined);
      }
    }
  };

  return (
    <Box component="form" noValidate autoComplete="off">
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Punto de Fuga
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          fullWidth
          label="Lugar"
          name="fugaLugar"
          value={expediente.fugaLugar || ''}
          onChange={handleChange}
          margin="normal"
          size="small"
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Latitud"
          name="fugaLatitud"
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
          name="fugaLongitud"
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

export default FugaTab; 