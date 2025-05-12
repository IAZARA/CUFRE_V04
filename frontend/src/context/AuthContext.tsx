import React, { createContext, useContext, useState, useEffect } from 'react';
import usuarioService from '../api/usuarioService';
import axiosClient from '../api/axiosClient';
import { Usuario, LoginRequest, AuthResponse, Rol, TwoFactorActivationRequired, TwoFactorValidationRequired } from '../types/usuario.types';

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

    console.log("Inicializando contexto de autenticación, token:", !!token);

    if (token) {
      if (userData) {
        try {
          // Si tenemos datos de usuario en localStorage, los usamos
          const parsedUser = JSON.parse(userData);
          console.log("Autenticación restaurada desde localStorage");
          setUser(parsedUser);
        } catch (error) {
          console.error('Error al parsear datos de usuario:', error);
          // Si hay error al parsear los datos, intentamos obtener el usuario desde el backend
          obtenerUsuarioDesdeBackend(token);
        }
      } else {
        // Si tenemos token pero no datos de usuario, intentamos obtenerlos
        obtenerUsuarioDesdeBackend(token);
      }
    } else {
      // Si no hay token, el usuario no está autenticado
      setUser(null);
    }

    setLoading(false);
  }, []);

  // Función para obtener datos del usuario usando el token existente
  const obtenerUsuarioDesdeBackend = async (token: string) => {
    try {
      const email = localStorage.getItem('last_email');
      if (!email) {
        console.error('No se encontró email en localStorage para obtener usuario');
        return;
      }

      // Intentar obtener datos del usuario actual usando el token
      console.log(`Intentando obtener usuario con email ${email}`);
      const response = await axiosClient.get(`/usuarios/search/email?email=${email}`);

      if (response.status === 200 && response.data) {
        const userData = response.data;
        // Guardar datos de usuario en localStorage
        const userToSave = {
          id: userData.id,
          nombre: userData.nombre,
          email: userData.email,
          rol: userData.rol
        };

        localStorage.setItem('user', JSON.stringify(userToSave));
        // Actualizar estado
        setUser(userToSave);
        console.log("✅ Datos de usuario obtenidos desde backend:", userToSave);
      } else {
        console.error('⚠️ No se pudo obtener datos del usuario desde backend:', response);
        // Si no podemos obtener el usuario, limpiamos el token
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Error al obtener datos del usuario:', error);
      // Si hay errores, limpiamos el token
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await usuarioService.login(credentials);

      // Si el backend responde con acción especial
      if ('action' in response) {
        // Verificar qué tipo de acción es y manejar el token temporal según corresponda
        if (response.action === 'activar_2fa' || response.action === 'validar_2fa') {
          const authResponse = response as (TwoFactorActivationRequired | TwoFactorValidationRequired);
          if (authResponse.temp_token) {
            console.log(`Guardando token temporal para acción ${response.action}`);
            localStorage.setItem('temp_token', authResponse.temp_token);
          } else {
            console.warn(`No se recibió token temporal para acción ${response.action}`);
          }
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