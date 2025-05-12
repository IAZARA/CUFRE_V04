import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Alert,
  CircularProgress,
  Link,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Por favor ingrese usuario y contraseña');
      return;
    }

    try {
      // Guardar credenciales para el proceso 2FA si fuera necesario
      if (rememberMe) {
        localStorage.setItem('last_email', username);
        localStorage.setItem('last_password', password);
      }

      const response = await login({ email: username, password });

      if ('action' in response) {
        // Simplemente verificar las acciones conocidas sin exhaustive checking
        if (response.action === 'cambiar_contrasena') {
          navigate('/cambiar-contrasena');
        } else if (response.action === 'activar_2fa') {
          navigate('/activar-2fa');
        } else if (response.action === 'validar_2fa') {
          // Para el flujo 2FA es importante guardar credenciales temporalmente
          // incluso si el usuario no marcó "recordarme"
          localStorage.setItem('last_email', username);
          localStorage.setItem('last_password', password);
          navigate('/validar-2fa');
        } else {
          // Usar type assertion para evitar errores de TypeScript
          // Este caso en teoría nunca debería ocurrir con los tipos actuales
          setError('Acción desconocida recibida');

          // Para depuración, registramos la respuesta completa
          console.error('Respuesta de acción desconocida:', response);
        }
      } else if ('token' in response) {
        // La redirección se maneja en el useEffect
        // Limpiar credenciales temporales si no quiere recordarlas
        if (!rememberMe) {
          localStorage.removeItem('last_email');
          localStorage.removeItem('last_password');
        }
      } else {
        setError('Respuesta inesperada del servidor');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3
            }}
          >
            <img src="/logo-cufre-2.png" alt="CUFRE Logo" style={{ height: 64, marginBottom: 8, marginTop: 8 }} />
            <Typography component="h1" variant="h5">
              Iniciar Sesión
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
              Comando Unificado Federal de Recaptura de Evadidos
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Usuario"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <FormControlLabel
              control={
                <Checkbox
                  value="remember"
                  color="primary"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Recordarme"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Ingresar'}
            </Button>
          </Box>
        </Paper>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
          {'© '}
          {new Date().getFullYear()}
          {' CUFRE - Sistema de Gestión de Expedientes'}
        </Typography>
      </Box>
    </Container>
  );
};

export default Login; 