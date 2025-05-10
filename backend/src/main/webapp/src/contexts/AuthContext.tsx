import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import apiClient from '../api/apiClient';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface JwtPayload {
  sub: string;
  exp: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar autenticación al cargar la página
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          // Token expirado
          localStorage.removeItem('token');
          setUser(null);
        } else {
          // Token válido
          setUser({
            id: parseInt(decoded.sub),
            nombre: decoded.nombre,
            apellido: decoded.apellido,
            email: decoded.email,
            rol: decoded.rol
          });
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.post('/auth/login', credentials);
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      
      const decoded = jwtDecode<JwtPayload>(token);
      setUser({
        id: parseInt(decoded.sub),
        nombre: decoded.nombre,
        apellido: decoded.apellido,
        email: decoded.email,
        rol: decoded.rol
      });
    } catch (error: any) {
      console.error('Error de inicio de sesión:', error);
      setError(error.response?.data?.message || 'Error en el inicio de sesión');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
