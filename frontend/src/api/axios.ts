import axios from 'axios';

// Configuración base para axios
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Crear una instancia de axios con configuración predeterminada
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token de autenticación a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    // Verificar si la URL es para 2FA y tenemos un token temporal
    const tempToken = localStorage.getItem('temp_token');
    if (tempToken &&
        (config.url?.includes('/auth/2fa-setup') ||
         config.url?.includes('/auth/activar-2fa') ||
         config.url?.includes('/auth/validar-2fa'))) {
      console.log('Usando token temporal para 2FA:', config.url);
      config.headers['Authorization'] = `Bearer ${tempToken}`;
      return config;
    }

    // Intentar obtener token directamente
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    }

    // Si no hay token directo, buscar en el objeto user
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.token) {
          config.headers['Authorization'] = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Error parsing user from localStorage', e);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores comunes en las respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log('Error response details:', error.response.status, error.response.data);

      // Si recibimos un 401 (no autorizado), el token es inválido o expiró
      if (error.response.status === 401) {
        // Limpiamos los datos de sesión
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Redirigir al login si no estamos ya en la página de login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Si recibimos un 403 (forbiden), el usuario no tiene permisos
      if (error.response.status === 403) {
        console.error('No tiene permisos para realizar esta acción');
        // No redirigimos, pero podríamos mostrar un mensaje
      }

      // Si recibimos un 500, 502, 503, 504 (errores de servidor)
      if (error.response.status >= 500) {
        console.error('Error en el servidor:', error.response.status, error.response.data);
      }
    } else {
      console.error('Error de red o petición cancelada:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 