import axios from 'axios';

const API_URL = 'http://localhost:8080';

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a las peticiones
axiosClient.interceptors.request.use(
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

    // Intentar usar token normal
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    }

    // Si no hay token, buscar en el objeto user
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

// Interceptor para manejar errores de respuesta
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.log('Error response:', error.response);

      if (error.response.status === 401) {
        // Redirigir a login si token expirado
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      // Manejo de 403 - Problemas de autorización
      if (error.response.status === 403) {
        console.error('Error de autorización. Es posible que no tengas permisos suficientes.');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient; 