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
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
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
    // Si recibimos un 401 (no autorizado), el token es inválido o expiró
    if (error.response && error.response.status === 401) {
      // Limpiamos los datos de sesión
      localStorage.removeItem('user');
      
      // Redirigir al login si no estamos ya en la página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Si recibimos un 403 (forbiden), el usuario no tiene permisos
    if (error.response && error.response.status === 403) {
      console.error('No tiene permisos para realizar esta acción');
    }
    
    // Si recibimos un 500, 502, 503, 504 (errores de servidor)
    if (error.response && error.response.status >= 500) {
      console.error('Error en el servidor:', error.response.status);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance; 