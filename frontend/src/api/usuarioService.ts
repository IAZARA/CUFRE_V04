import axiosClient from './axiosClient';
import { Usuario, LoginRequest, AuthResponse } from '../types/usuario.types';

const usuarioService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (user: Usuario): Promise<AuthResponse> => {
    const response = await axiosClient.post('/auth/register', user);
    return response.data;
  },
  
  getAll: async (): Promise<Usuario[]> => {
    const response = await axiosClient.get('/usuarios');
    return response.data;
  },
  
  getById: async (id: number): Promise<Usuario> => {
    const response = await axiosClient.get(`/usuarios/${id}`);
    return response.data;
  },
  
  create: async (usuario: Usuario): Promise<Usuario> => {
    try {
      const response = await axiosClient.post('/usuarios', usuario);
      return response.data;
    } catch (error: any) {
      console.error('Error al crear usuario:', error.response?.data || error.message);
      throw error;
    }
  },
  
  update: async (id: number, usuario: Usuario): Promise<Usuario> => {
    const response = await axiosClient.put(`/usuarios/${id}`, usuario);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await axiosClient.delete(`/usuarios/${id}`);
  },
  
  changePassword: async (id: number, newPassword: string): Promise<void> => {
    await axiosClient.patch(`/usuarios/${id}/password`, { newPassword });
  },
  
  findByEmail: async (email: string): Promise<Usuario> => {
    const response = await axiosClient.get(`/usuarios/search/email?email=${email}`);
    return response.data;
  },
  
  findByRol: async (rol: string): Promise<Usuario[]> => {
    const response = await axiosClient.get(`/usuarios/search/rol?rol=${rol}`);
    return response.data;
  },
  
  cambiarContrasena: async (nuevaContrasena: string): Promise<void> => {
    await axiosClient.post('/auth/change-password', { newPassword: nuevaContrasena });
  },

  obtenerQr2FA: async (): Promise<string> => {
    const response = await axiosClient.get('/auth/2fa-setup');
    return response.data.qrUrl;
  },

  activar2FA: async (codigo: string): Promise<void> => {
    await axiosClient.post('/auth/activar-2fa', { code: codigo });
  },

  validar2FA: async (codigo: string): Promise<{ token: string }> => {
    const response = await axiosClient.post('/auth/validar-2fa', { code: codigo });
    return response.data;
  },

  resetPasswordAnd2FA: async (id: number): Promise<void> => {
    await axiosClient.post(`/usuarios/${id}/reset-password`);
  }
};

export default usuarioService; 