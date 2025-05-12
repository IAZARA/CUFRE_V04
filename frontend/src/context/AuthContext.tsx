import React, { createContext, useContext, useState, useEffect } from 'react';
import usuarioService from '../api/usuarioService';
import { Usuario, LoginRequest, AuthResponse, Rol } from '../types/usuario.types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: {
    id?: number;
    nombre: string;
    email: string;
    rol: Rol;
  } | null;
  login: (credentials: LoginRequest) => Promise<AuthResponse>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay token guardado al cargar la aplicación
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error al parsear datos de usuario:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await usuarioService.login(credentials);

      // Si el backend responde con acción especial
      if ('action' in response) {
        // Si es activación de 2FA y tenemos token temporal, guardarlo
        if (response.action === 'activar_2fa' && response.temp_token) {
          localStorage.setItem('temp_token', response.temp_token);
        }
        return response;
      }

      // Guardar token y datos de usuario en localStorage solo si hay token
      if ('token' in response) {
        localStorage.setItem('token', response.token);

        const userData = {
          id: response.id,
          nombre: response.nombre,
          email: response.email,
          rol: response.rol
        };

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
      return response;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 