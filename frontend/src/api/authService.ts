import axios from './axios';
import { Usuario } from '../types/usuario.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Interceptor para añadir el token a todas las peticiones
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si recibimos un 401 (no autorizado), limpiamos el token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Opcional: redirigir al login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`/auth/login`, { email, password });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  },
  
  register: async (userData: any) => {
    try {
      const response = await axios.post(`/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  updateProfile: async (userId: number, userData: any) => {
    try {
      const response = await axios.put(`/usuarios/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      const userId = authService.getCurrentUser()?.usuario.id;
      
      if (!userId) {
        throw new Error('Usuario no autenticado');
      }
      
      const response = await axios.get(`/usuarios/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      throw error;
    }
  },
  
  // Interceptor para añadir token a las peticiones
  setupAxiosInterceptors: (token: string) => {
    axios.interceptors.request.use(
      config => {
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
  },

  getUserInfo: async () => {
    try {
      const response = await axios.get(`/auth/me`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Error al obtener información del usuario');
      }
      throw new Error('Error al conectar con el servidor');
    }
  },

  verifyToken: async (token: string) => {
    try {
      const response = await axios.post(`/auth/verify`, { token });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Token inválido');
      }
      throw new Error('Error al conectar con el servidor');
    }
  },

  refreshToken: async () => {
    try {
      const response = await axios.post(`/auth/refresh`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Error al renovar la sesión');
      }
      throw new Error('Error al conectar con el servidor');
    }
  }
};

export default authService; 