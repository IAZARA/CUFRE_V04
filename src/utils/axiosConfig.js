import axios from 'axios';

// Configurar interceptores
const setupAxiosInterceptors = () => {
  // Interceptor de solicitud
  axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  // Interceptor de respuesta
  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      // Manejar errores específicos aquí
      if (error.response && error.response.status === 401) {
        // Redirigir a login si el token ha expirado o es inválido
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

export default setupAxiosInterceptors; 